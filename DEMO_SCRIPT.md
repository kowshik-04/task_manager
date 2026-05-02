# Team Task Manager - Elite Demo (5 minutes)

**How to present this like you built a production system—because you did.**

---

## 🎬 Preparation (30 sec before you start)

```bash
docker compose up --build
# Wait for this exact message in logs:
# ✓ Backend running on port 5000
# ✓ Health check: GET /health
# Then open http://localhost:5173
```

**You'll use these accounts:**
- **Admin**: admin@test.com / admin123 (I control projects and members)
- **Member**: member@test.com / member123 (I see only my work)

---

## 🎥 Demo Script (Natural & Confident)

### 1️⃣ **Login → Dashboard** (1 min)

**Opening line:**  
"Let me start by logging in and showing you the dashboard. Notice how the system gives you instant visibility into team progress."

**Action:**
- Navigate to app
- Enter admin@test.com / admin123
- Dashboard loads

**What to say:**
"As you can see, we've got four key metrics: total tasks, completed, pending, and overdue. These are **role-scoped**—meaning each user only sees work they have access to. Here's why that matters: a member can never accidentally see someone else's private tasks."

**Confidence phrase:**
"This ensures data isolation at the application level, not just the database."

---

### 2️⃣ **Create a Project** (45 sec)

**Say:**  
"Projects are how we organize work. Let me create one to show you the full workflow."

**Action:**
- Click "Create Project"
- Enter:
  - Name: **"Website Redesign"**
  - Description: **"Modernize homepage and product pages with new design system"**
- Click "Create Project"

**What to highlight:**
"Notice the instant feedback—the project appears immediately without a page refresh. This is React doing what it's built for: responsive UX. The form also clears automatically, which tells the user the operation succeeded."

**Confidence phrase:**
"Good form feedback prevents user confusion about whether the action actually worked."

---

### 3️⃣ **Add a Team Member** (45 sec)

**Say:**  
"Now I'll add a team member to this project. This is where role-based access control comes in."

**Action:**
- Click into the project
- In "Project Members" section, select "Member User" from dropdown
- Click "Add"

**What to highlight:**
"Notice two things here:

1. **Only admins can manage members.** Members don't see this section at all.
2. **The system prevents duplicates.** See how the dropdown automatically filtered out members already on the project? That's defensive programming—we prevent invalid states before they happen."

**Confidence phrase:**
"The member will now see this project in their dashboard. Role-based access is enforced at the API level, so even if someone tried to hack the frontend, they still can't access unauthorized data."

---

### 4️⃣ **Create a Task & Assign It** (1 min)

**Say:**  
"Let me create a task and assign it to the team member. This shows how the system tracks work."

**Action:**
- In "Create Task" form:
  - Title: **"Design homepage mockups"**
  - Description: **"Create Figma designs for new hero section"**
  - Due date: **Tomorrow**
  - Assignee: **Member User**
- Click "Create Task"

**What to highlight:**
"The task appears instantly. Here's what's happening behind the scenes:

1. **Input validation** → We used Zod to validate every field before hitting the API
2. **Database integrity** → We created a composite unique constraint so the same person can't be added twice
3. **Real-time updates** → As soon as the task is created, the UI reflects it"

**Confidence phrase:**
"This is what production form handling looks like. No silent failures, no confusion."

---

### 5️⃣ **Switch to Member View** (1 min)

**Say:**  
"Now let me log out and show you what the member sees. This is the power of RBAC—different views for different roles."

**Action:**
- Logout (top right)
- Login as member@test.com / member123
- Navigate to the project (show the assigned task)
- Change task status from "TODO" to "IN_PROGRESS"

**What to highlight:**
"Three things to notice:

1. **Members only see their projects.** They can't see the admin-only project controls.
2. **Members can only update tasks assigned to them.** If I try to update someone else's task... I can't. That's enforced at the API level.
3. **Status updates are live.** The UI updates instantly, and the backend persists it."

**Confidence phrase:**
"This is what proper role-based access control looks like. Not just UI hiding—actual API permission checks."

---

### 6️⃣ **Back to Admin → Dashboard** (30 sec)

**Say:**  
"Let me go back to the admin view and show you the dashboard updated."

**Action:**
- Logout and login as admin again
- Go to Dashboard

**What to highlight:**
"Notice the overdue count updated, the pending count went down, and everything is consistent. This is **eventual consistency in action**—the system stays in sync because we're using a single source of truth."

---

### 7️⃣ **API Documentation** (Optional - 30 sec)

**Say:**  
"The entire API is documented and testable. This is crucial for team handoff."

**Action:**
- Open http://localhost:5000/api-docs
- Show one endpoint (e.g., POST /projects)
- Show request/response schema

**Confidence phrase:**
"Every endpoint has a Swagger schema. New team members can start contributing without confusion."

---

## 💡 Key Trust Signals to Land

When you're done, reviewers should think this:

✅ **"This person knows security"** → bcrypt, JWT, CORS, rate limiting, all mentioned  
✅ **"This person knows databases"** → Prisma, schema design, constraints  
✅ **"This person thinks about edge cases"** → Error handling, role checks, input validation  
✅ **"This person ships real systems"** → Docker, health checks, graceful shutdown  
✅ **"This person cares about UX"** → Instant feedback, clear errors, loading states  

---

## 🐛 If Something Goes Wrong (Have These Ready)

| Problem | What to say | Fix |
|---------|-------------|-----|
| Login fails | "Let me check the seed data..." | `docker compose logs backend \| grep "seed"` |
| Member can't see project | "Ah, I need to add them first. This is the admin workflow." | Add member via admin view |
| Task doesn't update | "Let me refresh..." | F5 |
| Docker won't start | "Let me check the logs..." | `docker compose logs -f backend` |

---

## ⏱️ Timing (You're Not Rushed)

- **Setup**: 30 sec (before demo starts)
- **Login**: 20 sec
- **Dashboard**: 20 sec  
- **Create project**: 30 sec
- **Add member**: 30 sec
- **Create task**: 40 sec
- **Member view**: 45 sec
- **Back to admin**: 15 sec
- **API docs** (optional): 30 sec
- **Questions**: 3 min

**Total: 5-8 minutes** depending on questions

---

## 🎯 You're Selling This Story

1. **Not features** → "I have projects, tasks, members"
2. **But systems** → "I built a system that handles authentication, authorization, and data integrity"

The demo isn't about clicking buttons. It's about proving you understand production engineering.

---

**Final note:** If someone asks "Why did you design it this way?"—you can explain every decision confidently, because you made intentional choices, not random ones.

**Highlight:** "Only admins can manage members. The member will see this project in their list."

### 4️⃣ Create a Task (1 min)

**Say:** "Let me create a task and assign it to the team member."

- In "Create Task" form:
  - Title: **"Design homepage mockups"**
  - Description: **"Create figma designs for homepage redesign"**
  - Due date: **Tomorrow**
  - Assignee: **Member User**
- Click "Create Task"
- Task appears in task list below

**Highlight:** "The task is immediately assigned and the member will see it in their view."

### 5️⃣ Switch to Member View (1 min)

**Say:** "Let me log out and show you what the member sees."

- Logout (top right)
- Login as **member@test.com** / **member123**
- Dashboard shows only tasks they can access
- Navigate to Task Management
- Show the assigned task
- Change status from "TODO" to "IN_PROGRESS"

**Highlight:** "Members can only update their own assigned tasks. They can't create projects or manage members."

### 6️⃣ Return to Admin View (30 sec)

**Say:** "Now let me show you the admin gets better visibility."

- Logout and login as admin again
- Go back to Dashboard
- Show that task count has updated in real-time

**Highlight:** "The dashboard shows accurate, role-scoped counts. Everything is live."

### 7️⃣ API Documentation (optional, 30 sec)

**Say:** "The API is fully documented with Swagger."

- Open browser console check for zero errors
- Navigate to http://localhost:5000/api-docs
- Show endpoint documentation
- Show request/response examples

**Highlight:** "Every endpoint is documented and can be tested right here."

---

## 💡 Key Points to Emphasize

✅ **Real Authentication** → JWT tokens, secure hashing  
✅ **Role-Based Access** → Different views for admin vs member  
✅ **Live Updates** → No page refreshes, instant feedback  
✅ **Clean UX** → Minimal design, easy to use  
✅ **Production Ready** → Error handling, validation, Docker  
✅ **Developer Friendly** → Clear code, good documentation  

---

## 🐛 If Something Goes Wrong

| Issue | Fix |
|-------|-----|
| "Can't connect to backend" | `docker compose logs backend` |
| "Login fails" | Verify seed ran: `docker compose logs backend \| grep seed` |
| "Task doesn't appear" | Refresh page (F5) |
| "Member can't see project" | Admin must add them first |

---

## ⏱️ Timing Guide

- **Setup**: 30 sec
- **Login**: 15 sec
- **Dashboard**: 20 sec
- **Create project**: 30 sec
- **Add member**: 30 sec
- **Create task**: 30 sec
- **Member view**: 30 sec
- **Back to admin**: 15 sec
- **API docs** (optional): 30 sec
- **Q&A**: 3 min

**Total: 5-8 minutes** depending on Q&A
