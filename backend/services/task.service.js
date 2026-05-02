import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/error.middleware.js';
import { verifyProjectAccess } from './project.service.js';

export const createTask = async ({ title, description, dueDate, assignedToId, projectId, createdById }) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true }
  });

  if (!project) {
    throw new AppError('This project does not exist', 404);
  }

  if (assignedToId) {
    const isMember = project.members.some((member) => member.userId === assignedToId) || project.createdById === assignedToId;
    if (!isMember) {
      throw new AppError('The assigned user is not a member of this project', 400);
    }
  }

  return prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: assignedToId || null,
      projectId,
      createdById
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
};

export const listTasksByProject = async ({ projectId, currentUser }) => {
  await verifyProjectAccess({ projectId, currentUser });

  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateTaskStatus = async ({ taskId, status, currentUser }) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new AppError('This task does not exist', 404);
  }

  if (currentUser.role === 'MEMBER' && task.assignedToId !== currentUser.id) {
    throw new AppError('You can only update tasks assigned to you', 403);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
};

export const getDashboardStats = async (currentUser) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const baseWhere =
    currentUser.role === 'ADMIN'
      ? {}
      : {
          OR: [
            { project: { members: { some: { userId: currentUser.id } } } },
            { project: { createdById: currentUser.id } },
            { assignedToId: currentUser.id }
          ]
        };

  const [totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
    prisma.task.count({ where: baseWhere }),
    prisma.task.count({ where: { ...baseWhere, status: 'DONE' } }),
    prisma.task.count({ where: { ...baseWhere, status: { not: 'DONE' } } }),
    prisma.task.count({
      where: {
        ...baseWhere,
        status: { not: 'DONE' },
        dueDate: { lt: todayStart }
      }
    })
  ]);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks
  };
};
