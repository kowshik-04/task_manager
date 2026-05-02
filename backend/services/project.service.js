import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

export const createProject = async ({ name, description, createdById }) => {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      createdById,
      members: {
        create: {
          userId: createdById
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      }
    }
  });

  return project;
};

export const deleteProject = async (projectId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  await prisma.project.delete({ where: { id: projectId } });
};

export const addMemberToProject = async ({ projectId, userId }) => {
  const [project, user] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId } }),
    prisma.user.findUnique({ where: { id: userId } })
  ]);

  if (!project) {
    throw new AppError('Project does not exist', 404);
  }

  if (!user) {
    throw new AppError('User does not exist', 404);
  }

  const existingMembership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId
      }
    }
  });

  if (existingMembership) {
    throw new AppError('This user is already a member of this project', 409);
  }

  return prisma.projectMember.create({
    data: {
      projectId,
      userId
    },
    include: {
      user: {
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

export const removeMemberFromProject = async ({ projectId, userId }) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.createdById === userId) {
    throw new AppError('Project creator cannot be removed from project', 400);
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId
      }
    }
  });

  if (!member) {
    throw new AppError('Project member not found', 404);
  }

  await prisma.projectMember.delete({ where: { id: member.id } });
};

export const listProjectsByAccess = async (currentUser) => {
  if (currentUser.role === 'ADMIN') {
    return prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            members: true,
            tasks: true
          }
        }
      }
    });
  }

  return prisma.project.findMany({
    where: {
      OR: [
        { createdById: currentUser.id },
        { members: { some: { userId: currentUser.id } } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          members: true,
          tasks: true
        }
      }
    }
  });
};

export const getProjectByAccess = async ({ projectId, currentUser }) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      },
      tasks: {
        orderBy: { createdAt: 'desc' },
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
      }
    }
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (currentUser.role === 'ADMIN') {
    return project;
  }

  const hasAccess = project.createdById === currentUser.id || project.members.some((member) => member.userId === currentUser.id);

  if (!hasAccess) {
    throw new AppError('Forbidden: you do not have access to this project', 403);
  }

  return project;
};

export const verifyProjectAccess = async ({ projectId, currentUser }) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: true
    }
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (currentUser.role === 'ADMIN') {
    return project;
  }

  const hasAccess = project.createdById === currentUser.id || project.members.some((member) => member.userId === currentUser.id);

  if (!hasAccess) {
    throw new AppError('Forbidden: project access denied', 403);
  }

  return project;
};
