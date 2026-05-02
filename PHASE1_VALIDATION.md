# 🚨 PHASE 1: LOCAL VALIDATION CHECKLIST

## ✅ Status: Systems Running

- ✅ Backend (Express + Postgres): **http://localhost:5001**
- ✅ Frontend (React Vite): **http://localhost:5173**
- ✅ Database (PostgreSQL): **localhost:5432**

---

## 📋 YOUR MANUAL TESTS (Follow in order)

### TEST 1: Backend Health Endpoints

**Action:** Open browser or curl
```bash
curl http://localhost:5001/health
curl http://localhost:5001/api-docs
```

**Expected Result:**
```json
{
  "success": true,
  "status": "healthy",
  "data": {
    "server": "running",
    "database": "connected"
  }
}
```

**Status:** ✅ PASS / ⏳ WAIT FOR YOUR CONFIRMATION

---

### TEST 2: Login (Admin Account)

**Action:**
1. Go to http://localhost:5173
2. Enter credentials:
   - Email: `admin@test.com`
   - Password: `admin123`
3. Click "Sign In"

**Expected Result:**
- ✅ Login succeeds
- ✅ Redirects to /dashboard
- ✅ Shows dashboard with metrics

**Error Handling Test:**
- Try wrong password
- Expected: "Invalid email or password" message (not generic "Login failed")

**Status:** ✅ PASS / ❌ FAIL — **What happened?**

---

### TEST 3: Create a Project (As Admin)

**Action:**
1. Click "Create Project" button
2. Fill form:
   - Name: `Website Redesign`
   - Description: `Modernize homepage with new design system`
3. Click "Create Project"

**Expected Result:**
- ✅ Green success box: "Project created successfully!"
- ✅ Project appears in project list
- ✅ Success message auto-hides after 3 seconds

**Status:** ✅ PASS / ❌ FAIL — **What error message?**

---

### TEST 4: Add Team Member

**Action:**
1. Click into the project
2. In "Project Members" section:
   - Select "Member User" from dropdown
   - Click "Add"

**Expected Result:**
- ✅ Green success box: "Member added successfully!"
- ✅ Member appears in members list
- ✅ Dropdown auto-clears

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 5: Create & Assign Task

**Action:**
1. In project, scroll to "Create Task"
2. Fill form:
   - Title: `Design homepage mockups`
   - Description: `Create Figma designs`
   - Due date: **Tomorrow**
   - Assignee: `Member User`
3. Click "Create Task"

**Expected Result:**
- ✅ Green success box: "Task created successfully!"
- ✅ Task appears in task list below
- ✅ Form clears

**Error Test:**
- Try creating task with 1-character title
- Expected: "Task title must be at least 2 characters"

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 6: Task Status Update

**Action:**
1. In task list, find the task you created
2. Click dropdown (says "TODO")
3. Change to "IN_PROGRESS"

**Expected Result:**
- ✅ Status changes immediately
- ✅ Green success box: "Task updated successfully!"
- ✅ No page refresh needed

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 7: Switch to Member View

**Action:**
1. Logout (top right corner)
2. Login as:
   - Email: `member@test.com`
   - Password: `member123`
3. Go to dashboard

**Expected Result:**
- ✅ Member sees only projects they're part of
- ✅ Member sees only tasks assigned to them
- ✅ Member can NOT create projects
- ✅ Member can NOT manage members

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 8: Member Can Update Assigned Task

**Action:**
1. As member, find your assigned task
2. Try to change status to "DONE"

**Expected Result:**
- ✅ Status updates successfully
- ✅ Green success box: "Task updated successfully!"

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 9: Error Handling - Network Error

**Action:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Toggle "Offline" mode
4. Try to create a project
5. Toggle offline mode back on

**Expected Result:**
- ✅ Error box appears: "Network error. Please check your internet connection and try again."
- ✅ Not a generic error
- ✅ Suggests action (check connection)

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 10: Error Handling - Authorization

**Action:**
1. As admin, create a task assigned to admin
2. Logout and login as member
3. Try to find and modify that admin-only task
   - (This might not be visible at all, which is correct)

**Expected Result:**
- ✅ Member cannot see admin-only tasks
- ✅ OR if visible, clicking "Update Status" shows: "You can only update tasks assigned to you"

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 11: API Documentation

**Action:**
```bash
curl http://localhost:5001/api-docs
```

OR visit: `http://localhost:5001/api-docs` in browser

**Expected Result:**
- ✅ Swagger UI loads
- ✅ All endpoints documented
- ✅ You can see request/response schemas

**Status:** ✅ PASS / ❌ FAIL

---

### TEST 12: Frontend Build

**Action:**
```bash
cd frontend
npm run build
```

**Expected Result:**
- ✅ Build completes without errors
- ✅ No console warnings
- ✅ Output file size reasonable (~230 kB gzipped)

**Status:** ✅ PASS / ❌ FAIL

---

## 🎯 FINAL CHECKLIST

Before confirming Phase 1 complete:

- [ ] Backend health endpoint returns `healthy: true`
- [ ] Frontend loads without errors
- [ ] Can login with admin account
- [ ] Can create project and see success message
- [ ] Can add member to project
- [ ] Can create task and assign it
- [ ] Task status updates work
- [ ] Member can only see their work
- [ ] Error messages are specific (not generic "Something went wrong")
- [ ] Frontend builds successfully
- [ ] API docs available

---

## ⛔ **STOP HERE**

**Do NOT proceed to PHASE 2 deployment until:**

1. ✅ All 12 tests above pass
2. ✅ No error messages in browser console
3. ✅ No error messages in terminal output
4. ✅ No port conflicts
5. ✅ No database connection issues

---

## 🚀 What to do next:

**If all tests pass:**
→ Reply: "✅ Everything works locally"

**If any test fails:**
→ Tell me: "TEST 3 failed with error: ___"
→ I'll debug and help fix

---

**IMPORTANT:** Do not skip tests. Each one validates a critical piece of the system.
