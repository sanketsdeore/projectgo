# ProjectGo — Team Project Management Platform

## Overview

ProjectGo is a full-stack project management platform designed for team collaboration and workspace-based organization management. The platform allows organizations to manage projects, tasks, team members, analytics, and workflows inside isolated workspaces.

The application supports role-based access control where administrators can manage projects, invite members, and control workflows, while regular members have restricted permissions.

---

# Features

## Authentication & Organization Management

* Secure authentication using Clerk
* Multi-workspace organization support
* Role-based access control (Admin / Member)
* Workspace member invitations

## Project Management

* Create and manage projects
* Project status tracking
* Project priority management
* Progress tracking
* Project search and filtering

## Task Management

* Create and assign tasks
* Task status updates
* Task priorities and deadlines
* Task filtering by status, priority, and assignee
* Real-time task progress tracking

## Team Management

* Invite workspace members
* View team member roles
* Search team members
* Admin/member permission handling

## Analytics Dashboard

* Completion rate tracking
* Active and overdue task tracking
* Task distribution analytics
* Project progress visualization
* Status and priority charts

## Calendar View

* Task deadline visualization
* Monthly, weekly, and daily calendar views

---

# Tech Stack

## Frontend

* React
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* React Big Calendar

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* Clerk Authentication
* Clerk Organizations

## Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

# Architecture

ProjectGo follows a full-stack client-server architecture.

* Frontend handles UI rendering, state management, and API communication.
* Backend exposes REST APIs for projects and tasks.
* MongoDB stores organization-scoped data.
* Clerk manages authentication and organization memberships.

Each project and task is scoped using an `orgId` to ensure proper workspace isolation between organizations.

---

# API Endpoints

## Projects

### Get All Projects

```http
GET /api/projects?orgId=:orgId
```

### Get Project By ID

```http
GET /api/projects/:id
```

### Create Project

```http
POST /api/projects
```

### Update Project

```http
PUT /api/projects/:id
```

---

## Tasks

### Get All Tasks

```http
GET /api/tasks?orgId=:orgId
```

### Get Tasks By Project

```http
GET /api/tasks/:projectId
```

### Create Task

```http
POST /api/tasks
```

### Update Task Status

```http
PUT /api/tasks/:id
```

---

# Database Models

## Project

* name
* description
* status
* priority
* progress
* startDate
* endDate
* orgId

## Task

* title
* type
* priority
* status
* assignee
* dueDate
* projectId
* orgId

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:

```env
VITE_API_URL=your_backend_url
```

Run frontend:

```bash
npm run dev
```

---

## Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run backend:

```bash
npm start
```

---

# Deployment

## Frontend

* Deploy frontend using Vercel
* Configure `VITE_API_URL`

## Backend

* Deploy backend using Render
* Configure environment variables

## Database

* Use MongoDB Atlas for production database hosting

---

# Challenges Solved

## Multi-Tenant Data Isolation

Implemented organization-scoped filtering using `orgId` to ensure workspace-level data separation.

## Role-Based Access Control

Implemented admin/member access restrictions using Clerk organization roles.

## Analytics Integration

Built dynamic analytics dashboards using live project and task data.

---

# Future Improvements

* Real-time collaboration
* Activity logs
* Notifications system
* WebSocket integration
* Advanced analytics
* File attachments
* Comments and discussions

---

# Author

Sanket Deore
