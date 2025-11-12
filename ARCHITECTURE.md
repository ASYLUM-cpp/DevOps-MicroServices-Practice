# System Architecture

## Microservices Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                      http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Frontend (Port 3000)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - Login/Register UI                                      │  │
│  │  - Task Management Interface                              │  │
│  │  - Token Storage (localStorage)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Calls (JWT Token)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 5000)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes:                                                   │  │
│  │  • /api/auth/*  → Auth Service                            │  │
│  │  • /api/tasks/* → Task Service                            │  │
│  │  • /health      → Health Check                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────┬──────────────────────────────┬────────────────────┘
              │                              │
              │ Proxy                        │ Proxy
              ▼                              ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   Auth Service (5001)    │    │   Task Service (5002)    │
│  ┌────────────────────┐  │    │  ┌────────────────────┐  │
│  │ • User Register    │  │    │  │ • Get Tasks        │  │
│  │ • User Login       │  │    │  │ • Create Task      │  │
│  │ • Token Verify     │  │    │  │ • Update Task      │  │
│  │ • JWT Generation   │  │    │  │ • Delete Task      │  │
│  │ • Password Hashing │  │    │  │ • JWT Verification │  │
│  └────────────────────┘  │    │  └────────────────────┘  │
│         (bcrypt)          │    │    (Token Required)      │
└──────────────────────────┘    └──────────────────────────┘

          ▲                              ▲
          │                              │
          └──────────────┬───────────────┘
                         │
                    Shared Config
                  (JWT_SECRET in .env)
```

## Request Flow Examples

### 1. User Registration
```
Frontend → Gateway → Auth Service
   POST /api/auth/register
   { username, email, password }
   
   ← 201 Created
   { token, user }
```

### 2. User Login
```
Frontend → Gateway → Auth Service
   POST /api/auth/login
   { email, password }
   
   ← 200 OK
   { token, user }
```

### 3. Create Task (Authenticated)
```
Frontend → Gateway → Task Service
   POST /api/tasks
   Headers: { Authorization: Bearer <token> }
   Body: { title, description }
   
   Task Service verifies JWT
   
   ← 201 Created
   { task }
```

### 4. Get Tasks (Authenticated)
```
Frontend → Gateway → Task Service
   GET /api/tasks
   Headers: { Authorization: Bearer <token> }
   
   Task Service verifies JWT
   Filter tasks by userId from token
   
   ← 200 OK
   { tasks: [...] }
```

## Security Layers

```
┌─────────────────────────────────────────┐
│ Layer 1: CORS Protection                │
│ • Only allowed origins can access       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Layer 2: JWT Authentication             │
│ • Token required for protected routes   │
│ • Token expiration: 24 hours            │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Layer 3: Password Security              │
│ • bcrypt hashing (10 rounds)            │
│ • Never store plain passwords           │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Layer 4: Service Isolation              │
│ • Microservices communicate via Gateway │
│ • No direct external access to services │
└─────────────────────────────────────────┘
```

## Docker Network

```
┌───────────────────────────────────────────────────┐
│              Docker Network: app-network          │
│                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Gateway   │  │   Auth     │  │   Task     │ │
│  │  :5000     │  │  Service   │  │  Service   │ │
│  │            │  │   :5001    │  │   :5002    │ │
│  └────────────┘  └────────────┘  └────────────┘ │
│        ▲               ▲               ▲         │
│        │               │               │         │
│        └───────────────┴───────────────┘         │
│                    Internal DNS                  │
│         (auth-service, task-service)             │
└───────────────────────────────────────────────────┘
              │
              │ Port Mapping
              ▼
┌───────────────────────────────────────────────────┐
│                    Host Machine                   │
│  localhost:3000 → Frontend                        │
│  localhost:5000 → Gateway                         │
│  localhost:5001 → Auth Service (exposed)          │
│  localhost:5002 → Task Service (exposed)          │
└───────────────────────────────────────────────────┘
```

## CI/CD Pipeline Flow

```
┌──────────┐
│  GitHub  │
│  Push    │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│  Lint & Test        │
│  (All Services)     │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Security Scan      │
│  (Trivy - FS)       │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Build Docker       │
│  Images             │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Push to Docker Hub │
│  (If not PR)        │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Scan Images        │
│  (Trivy)            │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Deploy             │
│  (Main branch only) │
└─────────────────────┘
```

## Data Flow

### Authentication Token Flow
```
1. User enters credentials
   ↓
2. Auth Service validates
   ↓
3. Generate JWT with { id, email }
   ↓
4. Frontend stores in localStorage
   ↓
5. Frontend includes in Authorization header
   ↓
6. Services verify token signature
   ↓
7. Extract user info from token
   ↓
8. Process request with user context
```

### Task Management Flow
```
1. User creates task in UI
   ↓
2. Frontend sends POST with JWT
   ↓
3. Gateway routes to Task Service
   ↓
4. Task Service verifies JWT
   ↓
5. Extract userId from token
   ↓
6. Create task with userId
   ↓
7. Store in memory (tasks array)
   ↓
8. Return task to frontend
   ↓
9. Frontend refreshes task list
```
