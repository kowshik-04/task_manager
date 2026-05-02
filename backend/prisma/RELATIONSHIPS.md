# Database Relationships

## Core Models

- `User`: Application users with role (`ADMIN` or `MEMBER`).
- `Project`: Workspace container created by a user.
- `ProjectMember`: Join table for many-to-many relation between users and projects.
- `Task`: Work item under a project with optional assignee.

## Relation Rules

- One `User` can create many `Project` records (`Project.createdById -> User.id`).
- One `Project` has many `ProjectMember` rows.
- One `User` can belong to many projects through `ProjectMember`.
- One `Project` has many `Task` rows.
- One `Task` can be assigned to one `User` (optional).
- One `User` can create many `Task` rows.

## Cascading Behavior

- Deleting a `Project` cascades to `ProjectMember` and `Task` rows.
- Deleting a `User` cascades to `ProjectMember` rows.
- If assigned user is deleted, `Task.assignedToId` is set to `NULL`.
- `Project.creator` and `Task.creator` use restrict semantics to preserve accountability.

## Indexing Strategy

- Unique index on `User.email`.
- Composite unique index on `ProjectMember(projectId, userId)`.
- Task indexes on `projectId`, `assignedToId`, `status`, and `dueDate` for dashboard and filtered queries.
