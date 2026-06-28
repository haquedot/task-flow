# TaskFlow – MERN Stack Production-Ready Task Tracker

TaskFlow is a premium, production-ready, clean-architecture Task Management application built using the MERN stack (MongoDB, Express, React, Node.js). It features responsive layout design, glassmorphic UI elements, dark mode toggles, real-time statistics, search auto-debounce, field validations, optimistic state updates, and full keyboard shortcut integrations.

---

## Tech Stack

### Frontend
- **React.js (Vite)** – High-performance development bundle
- **Redux Toolkit & React Redux** – Global state management
- **React Router DOM** – Layout nested routes
- **Axios** – Configured HTTP request client with error-normalizing interceptors
- **Tailwind CSS v4** – Harmonious color tokens and CSS variables
- **React Hook Form** – Performance-optimized form state and client validation
- **React Icons** – Modern feather and layout icons
- **React Hot Toast** – Responsive, stylish status notifications
- **Date-fns** – Lightweight date formatting utilities
- **Framer Motion** – Spring-driven layouts, hover effects, and list animations

### Backend
- **Node.js & Express.js** – Robust REST API server
- **MongoDB & Mongoose** – Document database schemas, indexing, and aggregation pipelines
- **Express Validator** – Request body input schemas validation
- **Dotenv, CORS, Morgan** – Configuration, resource sharing, and dev logging

### Deployment
- **Frontend** → Vercel
- **Backend** → Vercel Serverless Functions
- **Database** → MongoDB Atlas Cloud

---

## Project Folder Structure

```text
task-tracker/
├── backend/
│   ├── api/
│   │   └── index.js            # Vercel serverless entry point
│   ├── config/
│   │   └── db.js               # Mongoose database client
│   ├── controllers/
│   │   └── taskController.js   # API CRUD & stats logic
│   ├── middleware/
│   │   └── errorHandler.js     # Express global error catcher
│   ├── models/
│   │   └── taskModel.js        # Mongoose Schema (Title indexed)
│   ├── routes/
│   │   └── taskRoutes.js       # Express routes mapped to controllers
│   ├── validators/
│   │   └── taskValidator.js    # Express Validator rule checks
│   ├── .env.example
│   ├── app.js                  # Main Express App configs
│   ├── server.js               # Local runner entry
│   ├── vercel.json             # Vercel backend hosting configuration
│   └── postman_collection.json # API Request Postman templates
│
├── src/
│   ├── app/
│   │   └── store.ts            # Redux Toolkit store setup
│   ├── components/
│   │   ├── DeleteModal.tsx     # Delete confirmation popup
│   │   ├── EmptyState.tsx      # Illustration shown when no tasks match
│   │   ├── Loader.tsx          # Card skeleton layouts & spin loaders
│   │   ├── Navbar.tsx          # Brand, theme toggle & shortcuts help
│   │   ├── TaskCard.tsx        # Dashboard task grid cards
│   │   └── TaskForm.tsx        # Integrated Create/Edit task modal
│   ├── features/
│   │   └── tasks/
│   │       ├── taskSlice.ts    # Redux Reducers, selectors, cache state
│   │       └── taskThunk.ts    # Redux Async Thunks (Axios triggers)
│   ├── hooks/
│   │   └── redux.ts            # Type-safe useAppSelector & useAppDispatch
│   ├── layouts/
│   │   └── Layout.tsx          # Global navbar, outlet & Toast wrapper
│   ├── pages/
│   │   ├── Home.tsx            # Main stats dashboard, filters & list
│   │   ├── TaskDetails.tsx     # Single task inspection view page
│   │   └── NotFound.tsx        # 404 Error fallback
│   ├── services/
│   │   ├── api.ts              # Axios instance configuration
│   │   └── taskService.ts      # Task-specific endpoint integrations
│   ├── App.tsx                 # Routing manager
│   ├── index.css               # Tailwind CSS theme setup
│   └── main.tsx                # Redux wrapper root mount
│
├── .env.example
├── vite.config.ts
└── package.json
```

---

## Keyboard Shortcuts

The app contains built-in keyboard listener shortcuts to speed up desktop task updates:
- <kbd>C</kbd> – Open **Create Task** modal form
- <kbd>/</kbd> – Instantly focus the **Search Bar**
- <kbd>R</kbd> – **Reset** all active filters, sorting, and search inputs
- <kbd>D</kbd> – Toggle **Dark / Light theme** mode
- <kbd>Esc</kbd> – **Close** active forms, modals, or shortcut guides

---

## Local Installation & Running

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Database & Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Update the `MONGO_URI` with your connection string.

### 2. Frontend Configuration
1. Navigate back to the root directory:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Verify the API URL matches your local backend address (`http://localhost:5000/api`).

### 3. Launching Locally
We run backend and frontend concurrently.

- **Start Backend:** (From `/backend` folder)
  ```bash
  npm run dev
  ```
  *Serves API on `http://localhost:5000` with hot-reload watching.*

- **Start Frontend:** (From root folder)
  ```bash
  npm run dev
  ```
  *Serves React App on `http://localhost:5173` with Vite HMR.*

---

## REST API Documentation

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://<your-backend-vercel-url>/api`

### Endpoints

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Retrieves tasks matching query | `search`, `status`, `priority`, `sortBy`, `order`, `page`, `limit` |
| **GET** | `/tasks/stats` | Retrieves task counts and percentages | None |
| **GET** | `/tasks/:id` | Retrieves a single task details | None |
| **POST** | `/tasks` | Creates a new task | None (Body payload required) |
| **PUT** | `/tasks/:id` | Updates an existing task details | None (Body payload required) |
| **DELETE** | `/tasks/:id` | Deletes a task from database | None |

#### Example Task Body (POST/PUT):
```json
{
  "title": "Build UI Dashboard Layout",
  "description": "Develop a glassmorphism dashboard layout with grid structure.",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2026-10-31"
}
```

---

## Deployment Guide

### Backend Deployment (Vercel Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` inside the `backend/` folder to deploy.
3. Configure environment variables in the Vercel dashboard:
   - `MONGO_URI`: *Your Atlas MongoDB URI*
   - `CLIENT_URL`: *Your Vercel Frontend deployed URL*
4. Run `vercel --prod` to deploy to production.

### Frontend Deployment (Vercel)
1. Run `vercel` inside the root directory.
2. Configure the environment variable:
   - `VITE_API_URL`: *Your Vercel Backend deployed API URL*
3. Run `vercel --prod` to deploy to production.
