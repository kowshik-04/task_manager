export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Team Task Manager API',
    version: '1.0.0',
    description: 'REST API for project, member, and task management with role-based access control.'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ApiSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string' }
        }
      },
      SignupRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Alice Johnson' },
          email: { type: 'string', example: 'alice@team.com' },
          password: { type: 'string', example: 'StrongPass123' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'alice@team.com' },
          password: { type: 'string', example: 'StrongPass123' }
        }
      },
      CreateProjectRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Website Redesign' },
          description: { type: 'string', example: 'Redesign the company marketing website' }
        }
      },
      AddMemberRequest: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' }
        }
      },
      CreateTaskRequest: {
        type: 'object',
        required: ['title', 'projectId'],
        properties: {
          title: { type: 'string', example: 'Create wireframes' },
          description: { type: 'string', example: 'Build low-fidelity homepage wireframes' },
          dueDate: { type: 'string', format: 'date-time' },
          assignedToId: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' }
        }
      },
      UpdateTaskStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'], example: 'IN_PROGRESS' }
        }
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Projects', description: 'Project management endpoints' },
    { name: 'Tasks', description: 'Task management and dashboard endpoints' },
    { name: 'Users', description: 'User endpoints' }
  ],
  paths: {
    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create new user account',
        description: 'Registers a new user and returns an access token.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Signup successful',
            content: {
              'application/json': {
                example: {
                  success: true,
                  data: {
                    token: 'jwt.token.here',
                    user: { id: 'uuid', name: 'Alice', email: 'alice@team.com', role: 'MEMBER' }
                  },
                  message: 'Signup successful'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Logs in user with credentials and returns access token.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful'
          }
        }
      }
    },
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List accessible projects',
        description: 'Admin sees all projects. Member sees assigned/created projects.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Projects fetched successfully'
          }
        }
      },
      post: {
        tags: ['Projects'],
        summary: 'Create project (Admin)',
        description: 'Creates a new project and auto-adds creator as member.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProjectRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Project created successfully'
          }
        }
      }
    },
    '/api/projects/{projectId}': {
      get: {
        tags: ['Projects'],
        summary: 'Get project details',
        description: 'Returns project details including members and tasks.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Project fetched successfully'
          }
        }
      },
      delete: {
        tags: ['Projects'],
        summary: 'Delete project (Admin)',
        description: 'Deletes a project and cascades to tasks/memberships.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Project deleted successfully'
          }
        }
      }
    },
    '/api/projects/{projectId}/members': {
      post: {
        tags: ['Projects'],
        summary: 'Add member to project (Admin)',
        description: 'Adds an existing user as project member.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddMemberRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Member added successfully'
          }
        }
      }
    },
    '/api/projects/{projectId}/members/{userId}': {
      delete: {
        tags: ['Projects'],
        summary: 'Remove member from project (Admin)',
        description: 'Removes a member from project by user ID.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          },
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Member removed successfully'
          }
        }
      }
    },
    '/api/projects/{projectId}/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List tasks for project',
        description: 'Returns all tasks in a project for authorized users.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Project tasks fetched successfully'
          }
        }
      }
    },
    '/api/tasks': {
      post: {
        tags: ['Tasks'],
        summary: 'Create task (Admin)',
        description: 'Creates and assigns a task inside a project.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTaskRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Task created successfully'
          }
        }
      }
    },
    '/api/tasks/{taskId}/status': {
      patch: {
        tags: ['Tasks'],
        summary: 'Update task status',
        description: 'Member can update assigned task only. Admin can update any task.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTaskStatusRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Task status updated successfully'
          }
        }
      }
    },
    '/api/tasks/dashboard/stats': {
      get: {
        tags: ['Tasks'],
        summary: 'Get dashboard stats',
        description: 'Returns total, completed, pending and overdue task counts.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dashboard stats fetched successfully',
            content: {
              'application/json': {
                example: {
                  success: true,
                  data: {
                    totalTasks: 10,
                    completedTasks: 5,
                    pendingTasks: 4,
                    overdueTasks: 1
                  },
                  message: 'Dashboard stats fetched successfully'
                }
              }
            }
          }
        }
      }
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        description: 'Returns authenticated user profile.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profile fetched successfully'
          }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List users (Admin)',
        description: 'Returns all users for member assignment and administration.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Users fetched successfully'
          }
        }
      }
    }
  }
};
