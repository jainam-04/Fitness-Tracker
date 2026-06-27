# 🏋️ FitTrack — Fitness Tracking Application

> A full-stack MERN fitness tracking web application with role-based access control, daily streak tracking, water intake reminders, workout management, and body progress analytics.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Features](#3-features)
4. [Role-Based Access Control](#4-role-based-access-control)
5. [Project Structure](#5-project-structure)
   - [Backend File Structure](#backend-file-structure)
   - [Frontend File Structure](#frontend-file-structure)
6. [Database Schemas](#6-database-schemas)
7. [Backend API Reference](#7-backend-api-reference)
   - [Auth APIs](#auth-apis)
   - [Workout APIs](#workout-apis)
   - [Water Intake APIs](#water-intake-apis)
   - [Progress APIs](#progress-apis)
   - [Dashboard APIs](#dashboard-apis)
   - [Admin APIs](#admin-apis)
8. [Frontend Pages & API Usage](#8-frontend-pages--api-usage)
9. [Middleware Reference](#9-middleware-reference)
10. [File Upload Reference](#10-file-upload-reference)
11. [Environment Variables](#11-environment-variables)
12. [Installation & Setup](#12-installation--setup)
13. [Security Features](#13-security-features)

---

## 1. Project Overview

FitTrack is a web-based fitness tracking application built on the **MERN stack** (MongoDB, Express.js, React — here replaced with vanilla HTML/CSS/JS — and Node.js). It solves the common problem of scattered, manual fitness logging by providing a single, secure platform where users can:

- Log and manage **workout sessions** with exercises, duration, and calories
- Track **daily water intake** against a personal goal with a visual ring indicator
- Record **body measurements and progress photos** over time
- Monitor a **daily activity streak** that auto-updates on workout completion
- View a **personal dashboard** with analytics, heatmaps, and key stats
- (Admins) Manage all users, assign roles, and view platform-wide analytics
- (Trainers) Assign workout plans directly to users they coach

Every page in the application is **protected by JWT authentication**. Users who are not logged in are redirected to the login screen. Role-based middleware ensures that admin and trainer-only actions cannot be performed by regular users, even if they manipulate the frontend.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js | Server-side JavaScript runtime |
| **Framework** | Express.js | HTTP server, routing, middleware pipeline |
| **Database** | MongoDB + Mongoose | Document database, schema definition & validation |
| **Authentication** | JWT (jsonwebtoken) | Stateless access tokens + refresh tokens |
| **Password Hashing** | bcryptjs | Secure password storage (12 salt rounds) |
| **File Uploads** | Multer | Avatar, progress photo, document uploads |
| **Validation** | express-validator | Request body validation on all endpoints |
| **Security** | Helmet + CORS + express-rate-limit | HTTP headers, cross-origin policy, rate limiting |
| **Logging** | Morgan | HTTP request logging in development |
| **Frontend** | HTML5 + CSS3 + Vanilla JS | UI layer, no framework |
| **HTTP Client** | Axios | Frontend API calls with interceptors |

---

## 3. Features

### User Features
- **Secure auth** — register, login, logout, password change, token refresh
- **Profile management** — update name, age, weight, height, fitness goal, avatar photo
- **Workout tracking** — create, edit, delete, filter, search, and paginate workout sessions
- **Exercise logging** — each workout can contain multiple exercises with sets, reps, weight, duration
- **Daily streak** — auto-incremented when a workout is marked complete; resets if a day is missed
- **Water intake** — log water in ml, quick-add buttons (150/250/500ml), daily goal progress ring
- **Body progress** — log weight, body fat %, BMI, muscle mass, chest/waist/hips measurements
- **Progress photos** — upload photos alongside measurements for visual comparison
- **Dashboard** — streak counter, water ring, activity heatmap (last 30 days), today's workouts

### Trainer Features
- Everything a User can do, plus:
- **Assign workouts** to specific users by their email address

### Admin Features
- Everything a Trainer can do, plus:
- **Admin dashboard** — total users, trainers, workouts by category, user growth chart
- **User management** — list all users, view details, change roles, activate/deactivate, delete
- **Platform analytics** — aggregated stats across all users

---

## 4. Role-Based Access Control

Three roles are supported. The **very first user to register** is automatically assigned the `admin` role. Subsequent users cannot self-assign `admin` through the register endpoint.

| Action | User | Trainer | Admin |
|---|:---:|:---:|:---:|
| Register / Login | ✅ | ✅ | ✅ |
| View & edit own profile | ✅ | ✅ | ✅ |
| Create / edit / delete own workouts | ✅ | ✅ | ✅ |
| Log water intake | ✅ | ✅ | ✅ |
| Log body progress | ✅ | ✅ | ✅ |
| View personal dashboard | ✅ | ✅ | ✅ |
| Assign workouts to other users | ❌ | ✅ | ✅ |
| View all users' workouts | ❌ | ✅ | ✅ |
| Access admin dashboard | ❌ | ❌ | ✅ |
| Manage users (CRUD, roles, status) | ❌ | ❌ | ✅ |

---

## 5. Project Structure

### Backend File Structure

```
fitness-backend/
│
├── server.js                      # App entry point — Express setup, routes, middleware
│
├── .env.example                   # Environment variable template
├── package.json                   # Dependencies and scripts
│
├── config/
│   └── db.js                      # MongoDB connection using Mongoose
│
├── models/                        # Mongoose schemas and models
│   ├── User.js                    # User schema (auth, profile, streak, water goal)
│   ├── Workout.js                 # Workout + nested Exercise schema
│   ├── WaterLog.js                # Water intake log entries
│   └── Progress.js                # Body measurements and progress photos
│
├── controllers/                   # Route handler logic (no business logic in routes)
│   ├── authController.js          # register, login, logout, refreshToken, getMe, updateProfile, changePassword
│   ├── workoutController.js       # createWorkout, getWorkouts, getWorkout, updateWorkout, deleteWorkout, assignWorkout
│   ├── waterController.js         # logWater, getWaterLogs, getTodayWater, deleteWaterLog, updateWaterGoal
│   ├── progressController.js      # addProgress, getProgress, getProgressById, deleteProgress
│   ├── dashboardController.js     # getUserDashboard, getAdminDashboard
│   └── adminController.js         # getAllUsers, getUserById, updateUser, deleteUser, toggleUserStatus
│
├── routes/                        # Express routers — map URLs to controllers
│   ├── auth.js                    # /api/auth/*
│   ├── workout.js                 # /api/workouts/*
│   ├── water.js                   # /api/water/*
│   ├── progress.js                # /api/progress/*
│   ├── dashboard.js               # /api/dashboard/*
│   └── admin.js                   # /api/admin/*
│
├── middleware/                    # Custom Express middleware
│   ├── auth.js                    # protect (JWT verify) + authorize (RBAC)
│   ├── upload.js                  # Multer config for avatars, progress photos, documents
│   ├── validators.js              # express-validator rule sets for each route
│   └── errorHandler.js            # Central error handler + 404 handler
│
└── uploads/                       # Uploaded files (git-ignored in production)
    ├── avatars/                   # User profile photos
    ├── progress/                  # Progress photos
    └── documents/                 # Document uploads
```

### Frontend File Structure

```
fitness-frontend/
│
├── index.html                     # Login / Register page (public, no auth required)
│
├── css/
│   └── style.css                  # Full design system — tokens, layout, components, responsive
│
├── js/
│   ├── api.js                     # Axios instance, token management, all API methods, toast helper
│   └── layout.js                  # Shared sidebar/topbar renderer, navigation, logout
│
└── pages/                         # Protected pages (all redirect to index.html if not logged in)
    ├── dashboard.html             # Main dashboard — stats, streak, water ring, heatmap
    ├── workouts.html              # Workout list, create/edit modal, assign modal, filters
    ├── water.html                 # Water intake log, daily ring, quick-add, goal setting
    ├── progress.html              # Progress history table, add measurements modal, trends
    ├── profile.html               # User profile, avatar upload, password change
    └── admin.html                 # Admin panel — user management table (admin only)
```

---

## 6. Database Schemas

### User Schema — `models/User.js`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `name` | String | ✅ | 2–50 characters |
| `email` | String | ✅ | Unique, lowercase, validated format |
| `password` | String | ✅ | Min 6 chars; bcrypt-hashed; `select: false` |
| `role` | String (enum) | — | `user` \| `trainer` \| `admin`; default `user` |
| `avatar` | String | — | File path to uploaded image; default `null` |
| `isActive` | Boolean | — | Default `true`; admins can deactivate accounts |
| `age` | Number | — | 1–120 |
| `weight` | Number | — | In kilograms |
| `height` | Number | — | In centimetres |
| `fitnessGoal` | String (enum) | — | `weight_loss` \| `muscle_gain` \| `endurance` \| `flexibility` \| `general_fitness` |
| `currentStreak` | Number | — | Auto-managed; increments on daily workout completion |
| `longestStreak` | Number | — | Historical best streak; never decreases |
| `lastActivityDate` | Date | — | Date of most recent completed workout |
| `dailyWaterGoal` | Number | — | In ml; default `2000` |
| `refreshToken` | String | — | Stored for rotation; `select: false` |
| `createdAt` | Date | — | Auto (timestamps) |
| `updatedAt` | Date | — | Auto (timestamps) |

**Hooks:** `pre('save')` — hashes password if modified. `matchPassword()` — bcrypt compare helper.

---

### Workout Schema — `models/Workout.js`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `user` | ObjectId → User | ✅ | Owner of the workout |
| `title` | String | ✅ | Workout name |
| `category` | String (enum) | ✅ | `cardio` \| `strength` \| `flexibility` \| `sports` \| `yoga` \| `other` |
| `exercises` | [Exercise] | — | Array of embedded exercise sub-documents |
| `totalDuration` | Number | — | In minutes |
| `totalCaloriesBurned` | Number | — | Total calories for the session |
| `date` | Date | — | Defaults to `Date.now` |
| `notes` | String | — | Free-text session notes |
| `isCompleted` | Boolean | — | Default `false`; triggers streak update when set `true` |
| `assignedBy` | ObjectId → User | — | Set when a trainer/admin creates the workout for someone else |
| `createdAt` | Date | — | Auto (timestamps) |
| `updatedAt` | Date | — | Auto (timestamps) |

**Exercise Sub-Schema (embedded in `exercises[]`):**

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `sets` | Number | Optional |
| `reps` | Number | Optional |
| `duration` | Number | In minutes |
| `weight` | Number | In kg |
| `caloriesBurned` | Number | Per exercise |
| `notes` | String | Optional notes |

---

### WaterLog Schema — `models/WaterLog.js`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `user` | ObjectId → User | ✅ | Owner |
| `amount` | Number | ✅ | In ml; minimum 1 |
| `date` | Date | — | Defaults to `Date.now` |
| `note` | String | — | Optional label (e.g. "After workout") |
| `createdAt` | Date | — | Auto (timestamps) |
| `updatedAt` | Date | — | Auto (timestamps) |

---

### Progress Schema — `models/Progress.js`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `user` | ObjectId → User | ✅ | Owner |
| `weight` | Number | — | In kg |
| `bodyFat` | Number | — | Percentage (0–100) |
| `muscleMass` | Number | — | In kg |
| `bmi` | Number | — | Auto-calculated from weight + user's height if not provided |
| `chest` | Number | — | In cm |
| `waist` | Number | — | In cm |
| `hips` | Number | — | In cm |
| `notes` | String | — | Free text |
| `date` | Date | — | Defaults to `Date.now` |
| `progressPhoto` | String | — | File path to uploaded image; default `null` |
| `createdAt` | Date | — | Auto (timestamps) |
| `updatedAt` | Date | — | Auto (timestamps) |

---

## 7. Backend API Reference

**Base URL:** `http://localhost:5000/api`

**Authentication header (all protected routes):**
```
Authorization: Bearer <accessToken>
```

**Standard error response:**
```json
{ "success": false, "message": "Description of error" }
```

---

### Auth APIs

#### `POST /api/auth/register` — Public
Register a new user account.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```
> `role` is optional. Values: `user`, `trainer`. Passing `admin` is silently overridden to `user` unless this is the first-ever registration.

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful",
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user", "avatar": null }
}
```

---

#### `POST /api/auth/login` — Public
Authenticate and receive tokens.

**Request body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response `200`:**
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "...", "name": "John Doe", "email": "john@example.com",
    "role": "user", "avatar": null, "currentStreak": 5, "dailyWaterGoal": 2000
  }
}
```

---

#### `POST /api/auth/refresh-token` — Public
Get a new access token using a valid refresh token.

**Request body:**
```json
{ "refreshToken": "eyJ..." }
```

**Response `200`:**
```json
{ "success": true, "accessToken": "eyJ...", "refreshToken": "eyJ..." }
```

---

#### `POST /api/auth/logout` — 🔒 Protected
Invalidate the stored refresh token server-side.

**Response `200`:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

#### `GET /api/auth/me` — 🔒 Protected
Get the current authenticated user's full profile.

**Response `200`:**
```json
{ "success": true, "user": { ...all User fields except password and refreshToken } }
```

---

#### `PUT /api/auth/update-profile` — 🔒 Protected
Update profile fields and/or avatar photo. Send as `multipart/form-data`.

**Form fields:** `name`, `age`, `weight`, `height`, `fitnessGoal`, `dailyWaterGoal`
**File field:** `avatar` (image file, max 2MB)

**Response `200`:**
```json
{ "success": true, "message": "Profile updated", "user": { ...updated user } }
```

---

#### `PUT /api/auth/change-password` — 🔒 Protected
Change the current user's password.

**Request body:**
```json
{ "currentPassword": "old123", "newPassword": "new456" }
```

**Response `200`:**
```json
{ "success": true, "message": "Password changed successfully" }
```

---

### Workout APIs

#### `GET /api/workouts` — 🔒 Protected
Get a paginated, filterable list of workouts.
- Regular users see **only their own** workouts.
- Trainers and admins see **all users'** workouts.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `category` | String | Filter by category (`cardio`, `strength`, etc.) |
| `isCompleted` | Boolean | `true` or `false` |
| `startDate` | ISO Date | Range start (inclusive) |
| `endDate` | ISO Date | Range end (inclusive) |
| `search` | String | Case-insensitive search on title |
| `page` | Number | Default `1` |
| `limit` | Number | Default `10` |

**Response `200`:**
```json
{
  "success": true,
  "count": 10,
  "total": 47,
  "totalPages": 5,
  "currentPage": 1,
  "workouts": [ { ...workout }, ... ]
}
```

---

#### `POST /api/workouts` — 🔒 Protected
Create a new workout session.

**Request body:**
```json
{
  "title": "Morning Run",
  "category": "cardio",
  "exercises": [
    { "name": "Running", "duration": 30, "caloriesBurned": 300 }
  ],
  "totalDuration": 30,
  "totalCaloriesBurned": 300,
  "date": "2024-06-15",
  "notes": "Felt great today",
  "isCompleted": true
}
```
> Setting `isCompleted: true` automatically triggers streak recalculation for the user.

**Response `201`:**
```json
{ "success": true, "message": "Workout created", "workout": { ... } }
```

---

#### `GET /api/workouts/:id` — 🔒 Protected
Get a single workout by ID. Users can only view their own; trainers/admins can view any.

**Response `200`:**
```json
{ "success": true, "workout": { ...populated workout with user and assignedBy } }
```

---

#### `PUT /api/workouts/:id` — 🔒 Protected
Update a workout. Users can only update their own; admins can update any.

**Request body:** Any subset of workout fields.

**Response `200`:**
```json
{ "success": true, "message": "Workout updated", "workout": { ... } }
```

---

#### `DELETE /api/workouts/:id` — 🔒 Protected
Delete a workout. Users can only delete their own; admins can delete any.

**Response `200`:**
```json
{ "success": true, "message": "Workout deleted" }
```

---

#### `POST /api/workouts/assign` — 🔒 Trainer / Admin only
Assign a workout plan to another user.

**Request body:**
```json
{
  "userId": "64abc123...",
  "title": "Leg Day",
  "category": "strength",
  "exercises": [ { "name": "Squats", "sets": 4, "reps": 12 } ],
  "notes": "Focus on form, not weight"
}
```

**Response `201`:**
```json
{ "success": true, "message": "Workout assigned successfully", "workout": { ... } }
```

---

### Water Intake APIs

#### `POST /api/water` — 🔒 Protected
Log a water intake entry.

**Request body:**
```json
{ "amount": 500, "note": "After gym session" }
```

**Response `201`:**
```json
{ "success": true, "message": "Water intake logged", "log": { ... } }
```

---

#### `GET /api/water` — 🔒 Protected
Get paginated water logs with today's summary.

**Query parameters:** `startDate`, `endDate`, `page`, `limit`

**Response `200`:**
```json
{
  "success": true,
  "count": 5,
  "total": 23,
  "todayTotal": 1750,
  "dailyGoal": 2000,
  "goalAchieved": false,
  "logs": [ { ... } ]
}
```

---

#### `GET /api/water/today` — 🔒 Protected
Get a detailed summary of today's water intake.

**Response `200`:**
```json
{
  "success": true,
  "totalAmount": 1500,
  "dailyGoal": 2000,
  "remaining": 500,
  "percentAchieved": 75,
  "goalAchieved": false,
  "logs": [ { ... } ]
}
```

---

#### `PUT /api/water/goal` — 🔒 Protected
Update the user's daily water goal.

**Request body:**
```json
{ "dailyWaterGoal": 2500 }
```

**Response `200`:**
```json
{ "success": true, "message": "Daily water goal updated", "dailyWaterGoal": 2500 }
```

---

#### `DELETE /api/water/:id` — 🔒 Protected
Delete a water log entry. Only the owner can delete their own entries.

**Response `200`:**
```json
{ "success": true, "message": "Water log deleted" }
```

---

### Progress APIs

#### `POST /api/progress` — 🔒 Protected
Add a new body measurement record. Send as `multipart/form-data`.

**Form fields:** `weight`, `bodyFat`, `muscleMass`, `bmi`, `chest`, `waist`, `hips`, `notes`
**File field:** `progressPhoto` (image file, max 5MB)

> BMI is auto-calculated if `weight` is provided and the user has `height` in their profile.

**Response `201`:**
```json
{ "success": true, "message": "Progress logged", "progress": { ... } }
```

---

#### `GET /api/progress` — 🔒 Protected
Get paginated progress history with trend analysis.

**Query parameters:** `startDate`, `endDate`, `page`, `limit`

**Response `200`:**
```json
{
  "success": true,
  "count": 10,
  "total": 24,
  "totalPages": 3,
  "trends": {
    "weightChange": -2.5,
    "bodyFatChange": -1.2
  },
  "records": [ { ... } ]
}
```
> `trends` compares the latest record vs the earliest record in the returned results. Negative values indicate improvement for weight/body fat.

---

#### `GET /api/progress/:id` — 🔒 Protected
Get a single progress record by ID.

---

#### `DELETE /api/progress/:id` — 🔒 Protected
Delete a progress record. Only the owner can delete their own records.

---

### Dashboard APIs

#### `GET /api/dashboard` — 🔒 Protected
Get the personal dashboard for the logged-in user.

**Response `200`:**
```json
{
  "success": true,
  "dashboard": {
    "user": {
      "name": "John Doe",
      "role": "user",
      "currentStreak": 7,
      "longestStreak": 14,
      "fitnessGoal": "weight_loss"
    },
    "workouts": {
      "total": 52,
      "completed": 48,
      "today": 1,
      "thisWeek": 4,
      "completionRate": 92
    },
    "water": {
      "todayTotal": 1750,
      "dailyGoal": 2000,
      "percentAchieved": 87,
      "goalAchieved": false
    },
    "calories": {
      "last30Days": 18400
    },
    "latestProgress": { ...most recent Progress record or null },
    "activityHeatmap": {
      "2024-06-01": 2,
      "2024-06-02": 1,
      ...
    }
  }
}
```
> `activityHeatmap` is a `{ "YYYY-MM-DD": count }` map of completed workouts per day for the last 30 days.

---

#### `GET /api/dashboard/admin` — 🔒 Admin only
Get platform-wide analytics for the admin panel.

**Response `200`:**
```json
{
  "success": true,
  "adminDashboard": {
    "users": { "total": 340, "active": 315, "trainers": 12 },
    "workouts": {
      "total": 4821,
      "byCategory": [
        { "_id": "strength", "count": 1240 },
        { "_id": "cardio", "count": 980 }
      ]
    },
    "userGrowth": [
      { "_id": "2024-06-10", "count": 5 },
      { "_id": "2024-06-11", "count": 8 }
    ],
    "recentUsers": [ { ...user }, ... ]
  }
}
```

---

### Admin APIs

All admin routes require `role: admin`. Non-admins receive `403 Forbidden`.

#### `GET /api/admin/users` — 🔒 Admin only
Get a paginated, searchable list of all users.

**Query parameters:**

| Param | Description |
|---|---|
| `role` | Filter by `user`, `trainer`, or `admin` |
| `isActive` | `true` or `false` |
| `search` | Searches name and email |
| `page` | Default `1` |
| `limit` | Default `10` |

**Response `200`:**
```json
{
  "success": true,
  "count": 10,
  "total": 340,
  "totalPages": 34,
  "users": [ { ...user without password/refreshToken }, ... ]
}
```

---

#### `GET /api/admin/users/:id` — 🔒 Admin only
Get full details of a specific user including their workout count.

**Response `200`:**
```json
{ "success": true, "user": { ... }, "workoutCount": 47 }
```

---

#### `PUT /api/admin/users/:id` — 🔒 Admin only
Update a user's `name`, `role`, or `isActive` status.

**Request body:**
```json
{ "role": "trainer", "isActive": true }
```
> Cannot demote the last remaining admin.

**Response `200`:**
```json
{ "success": true, "message": "User updated", "user": { ... } }
```

---

#### `DELETE /api/admin/users/:id` — 🔒 Admin only
Permanently delete a user and all their associated workout data.

> Cannot delete your own account via this endpoint.

**Response `200`:**
```json
{ "success": true, "message": "User and all associated data deleted" }
```

---

#### `PUT /api/admin/users/:id/toggle-status` — 🔒 Admin only
Toggle a user's `isActive` between `true` and `false`. Deactivated users cannot log in.

**Response `200`:**
```json
{ "success": true, "message": "User deactivated successfully", "isActive": false }
```

---

## 8. Frontend Pages & API Usage

All pages in `pages/` are protected. At the top of every page's `<script>`, `requireAuth()` checks `localStorage` for a valid token and redirects to `index.html` if none is found.

The Axios instance in `js/api.js` automatically:
1. Attaches `Authorization: Bearer <token>` to every request
2. Detects `401` responses and attempts a silent token refresh
3. If refresh fails, clears localStorage and redirects to login

---

### `index.html` — Login / Register

| Action | API Call | Method |
|---|---|---|
| Login form submit | `API.auth.login({ email, password })` | POST `/api/auth/login` |
| Register form submit | `API.auth.register({ name, email, password, role })` | POST `/api/auth/register` |
| On success | `Auth.setSession(data)` → redirect to `pages/dashboard.html` | — |

---

### `pages/dashboard.html` — Main Dashboard

| Action | API Call | Method |
|---|---|---|
| Load all stats on page open | `API.dashboard.getUser()` | GET `/api/dashboard` |
| Load today's workouts | `API.workouts.getAll({ startDate: today, endDate: today })` | GET `/api/workouts` |
| Quick-add water (150/250/500ml) | `API.water.log({ amount, note })` | POST `/api/water` |

**Renders:** streak fire counter, animated water ring (SVG), 4 stat cards, 30-day activity heatmap, today's workout list, latest body measurements.

---

### `pages/workouts.html` — Workout Manager

| Action | API Call | Method |
|---|---|---|
| Load workout list | `API.workouts.getAll({ page, category, isCompleted, search, startDate })` | GET `/api/workouts` |
| Create workout (modal) | `API.workouts.create(payload)` | POST `/api/workouts` |
| Edit workout (modal) | `API.workouts.update(id, payload)` | PUT `/api/workouts/:id` |
| Delete workout | `API.workouts.delete(id)` | DELETE `/api/workouts/:id` |
| Assign to user (trainer/admin) | `API.admin.getUsers({ search: email })` then `API.workouts.assign(payload)` | GET + POST |
| Pagination click | `API.workouts.getAll({ page: n })` | GET `/api/workouts` |
| Filter / search | `API.workouts.getAll({ ...filters })` | GET `/api/workouts` |

---

### `pages/water.html` — Water Intake Tracker

| Action | API Call | Method |
|---|---|---|
| Load today's summary and ring | `API.water.getToday()` | GET `/api/water/today` |
| Load log history | `API.water.getAll({ page, startDate, endDate })` | GET `/api/water` |
| Log water (form/quick buttons) | `API.water.log({ amount, note })` | POST `/api/water` |
| Update daily goal | `API.water.updateGoal({ dailyWaterGoal })` | PUT `/api/water/goal` |
| Delete a log entry | `API.water.delete(id)` | DELETE `/api/water/:id` |

---

### `pages/progress.html` — Body Progress

| Action | API Call | Method |
|---|---|---|
| Load progress history | `API.progress.getAll({ page, startDate, endDate })` | GET `/api/progress` |
| Add new measurements (modal) | `API.progress.create(formData)` — multipart | POST `/api/progress` |
| Delete a record | `API.progress.delete(id)` | DELETE `/api/progress/:id` |

**Renders:** measurement history table with trend indicators (↑ / ↓), trend summary (weight change, body fat change), progress photo thumbnails.

---

### `pages/profile.html` — User Profile

| Action | API Call | Method |
|---|---|---|
| Load current profile | `API.auth.getMe()` | GET `/api/auth/me` |
| Save profile changes | `API.auth.updateProfile(formData)` — multipart | PUT `/api/auth/update-profile` |
| Change password | `API.auth.changePassword({ currentPassword, newPassword })` | PUT `/api/auth/change-password` |

---

### `pages/admin.html` — Admin Panel *(Admin role only)*

| Action | API Call | Method |
|---|---|---|
| Load admin stats | `API.dashboard.getAdmin()` | GET `/api/dashboard/admin` |
| Load users table | `API.admin.getUsers({ page, role, isActive, search })` | GET `/api/admin/users` |
| Change a user's role | `API.admin.updateUser(id, { role })` | PUT `/api/admin/users/:id` |
| Toggle active status | `API.admin.toggleStatus(id)` | PUT `/api/admin/users/:id/toggle-status` |
| Delete a user | `API.admin.deleteUser(id)` | DELETE `/api/admin/users/:id` |

---

## 9. Middleware Reference

### `middleware/auth.js`

**`protect`** — Applied to all routes that require a logged-in user.
- Reads `Authorization: Bearer <token>` from headers (or `token` cookie as fallback)
- Verifies the JWT using `JWT_SECRET`
- Fetches the user from DB and attaches to `req.user`
- Returns `401` if no token, token invalid, or token expired
- Returns `403` if the user account is deactivated

**`authorize(...roles)`** — Applied after `protect` to restrict by role.
```js
// Example usage in a route:
router.get('/admin-only', protect, authorize('admin'), handler);
router.post('/assign', protect, authorize('trainer', 'admin'), handler);
```
- Returns `403` if `req.user.role` is not in the allowed roles list

---

### `middleware/upload.js`

Three Multer instances with disk storage:

| Export | Destination | Max Size | Allowed Types |
|---|---|---|---|
| `uploadAvatar` | `uploads/avatars/` | 2 MB | jpeg, jpg, png, gif, webp |
| `uploadProgress` | `uploads/progress/` | 5 MB | jpeg, jpg, png, gif, webp |
| `uploadDocument` | `uploads/documents/` | 10 MB | pdf, doc, docx, txt, csv, xlsx |

**`handleMulterError`** — Error-handling middleware placed after Multer. Converts `MulterError` (e.g. file too large) into clean JSON responses.

---

### `middleware/validators.js`

Built with `express-validator`. Each validator is an array of rules + the `validate` result-checker middleware:

| Export | Used on |
|---|---|
| `registerValidator` | POST `/api/auth/register` |
| `loginValidator` | POST `/api/auth/login` |
| `workoutValidator` | POST `/api/workouts` |
| `waterLogValidator` | POST `/api/water` |
| `progressValidator` | POST `/api/progress` |

---

### `middleware/errorHandler.js`

**`errorHandler`** — Central Express error handler (4-argument middleware). Handles:
- Mongoose `CastError` → `404` invalid ID
- Mongoose duplicate key (`code 11000`) → `400` field already exists
- Mongoose `ValidationError` → `400` with all field messages
- `JsonWebTokenError` → `401`
- `TokenExpiredError` → `401`
- All other errors → `500`

In development, the stack trace is included in the response.

**`notFound`** — Catch-all for undefined routes, returns `404`.

---

## 10. File Upload Reference

Files are served as static assets from `/uploads/*` via:
```js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

Uploaded file paths are stored in the database as relative paths (e.g. `/uploads/avatars/avatar_64abc_1700000000000.jpg`) and prepended with the API base URL when displayed in the frontend.

| Upload Type | Field Name | Route | Max Size |
|---|---|---|---|
| Avatar | `avatar` | PUT `/api/auth/update-profile` | 2 MB |
| Progress photo | `progressPhoto` | POST `/api/progress` | 5 MB |
| Document | `file` | (available via `uploadDocument`) | 10 MB |

---

## 11. Environment Variables

Create a `.env` file at the root of `fitness-backend/` based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/fitness_tracker

# JWT — use long random strings in production
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

JWT_REFRESH_SECRET=your_refresh_secret_key_change_this
JWT_REFRESH_EXPIRE=30d

# Frontend URL for CORS
CLIENT_URL=http://localhost:3000
```

---

## 12. Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas URI)
- npm

### Backend Setup

```bash
# Clone or extract the project
cd fitness-backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT secrets

# Start development server (auto-restart with nodemon)
npm run dev

# OR start production server
npm start
```

Server starts at: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

### Frontend Setup

The frontend is pure HTML/CSS/JS — no build step needed.

```bash
# Option 1: Open directly in browser
open fitness-frontend/index.html

# Option 2: Serve with a simple static server (recommended to avoid CORS issues)
npx serve fitness-frontend
# or
npx http-server fitness-frontend -p 3000
```

Frontend runs at: `http://localhost:3000`

> **Important:** Make sure the backend is running before using the frontend. The API base URL in `js/api.js` is set to `http://localhost:5000/api` — update this if your backend is on a different host/port.

### First-time Use
1. Start the backend
2. Open the frontend in your browser
3. Click **Create Account**
4. The first registered user automatically becomes **Admin**
5. Register additional accounts to test `user` and `trainer` roles

---

## 13. Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs with 12 salt rounds |
| JWT access tokens | Short-lived (7 days), signed with `JWT_SECRET` |
| JWT refresh tokens | Long-lived (30 days), rotated on each use, stored in DB |
| Token invalidation on logout | Refresh token set to `null` in DB |
| Account deactivation | `isActive: false` blocks login without deleting data |
| Rate limiting | 100 req / 15 min globally; 10 req / 15 min on auth endpoints |
| HTTP security headers | Helmet middleware (X-Frame-Options, CSP, etc.) |
| CORS | Restricted to `CLIENT_URL` origin only |
| Input validation | express-validator on all POST/PUT endpoints |
| Role enforcement | Server-side middleware — frontend role checks are UX only |
| Last admin protection | Cannot demote or delete the last admin account |
| File type validation | Multer `fileFilter` rejects disallowed MIME types and extensions |
| File size limits | Per-upload-type size caps enforced by Multer |
| No sensitive fields in responses | `password` and `refreshToken` use `select: false` in Mongoose |

---

*Built for Fourise Software Solutions Pvt. Ltd. — CIN: U62099PN2023PTC218917*
