import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { prisma, connectWithRetry } from './config/prisma.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import { swaggerSpec } from './docs/swagger.js';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

// Determine allowed origins for CORS
const allowedOrigins = [env.frontendUrl];
if (env.nodeEnv === 'development') {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175');
}

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

/**
 * Health check endpoint for deployment/load balancer monitoring.
 * Returns 200 if system is ready to receive traffic, 503 if degraded.
 */
app.get('/health', async (req, res) => {
  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      data: {
        server: 'running',
        database: 'connected'
      },
      message: 'Service is ready to receive traffic'
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      data: {
        server: 'running',
        database: 'disconnected'
      },
      message: 'Database connection failed'
    });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

let server;

const shutdown = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception:', error);
  await shutdown();
});
process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled rejection:', reason);
  await shutdown();
});

const startServer = async () => {
  try {
    console.log('\n=== Backend Startup Sequence ===');
    console.log(`[1/3] Environment: ${env.nodeEnv}`);
    console.log(`[1/3] Database URL: ${env.databaseUrl?.split('@')[1] || 'N/A'} (masked)`);
    
    console.log('[2/3] Connecting to database with retry logic...');
    await connectWithRetry();

    console.log('[3/3] Starting Express server...');
    server = app.listen(env.port, () => {
      console.log(`✓ Backend running on port ${env.port}`);
      console.log(`✓ Health check: GET /health`);
      console.log(`✓ API docs: GET /api-docs`);
      console.log('=== Backend Ready ===\n');
    });
  } catch (error) {
    console.error('\n❌ Failed to start backend:');
    console.error(`   ${error.message}`);
    console.error('\nTroubleshooting:');
    console.error('  1. Verify DATABASE_URL is correct');
    console.error('  2. Verify PostgreSQL is running and accessible');
    console.error('  3. Check firewall/network rules');
    console.error('  4. Wait a few seconds and retry\n');
    process.exit(1);
  }
};

startServer();
