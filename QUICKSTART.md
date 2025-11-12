# 🚀 Quick Start Guide

## Get Started in 3 Steps

### 1️⃣ Start All Services
```powershell
docker-compose up --build
```

### 2️⃣ Open the Application
Open your browser and navigate to:
```
http://localhost:3000
```

### 3️⃣ Test the Application

1. **Register a new account:**
   - Click "Register"
   - Enter username, email, and password
   - Click "Register" button

2. **Create tasks:**
   - Once logged in, use the "Create New Task" form
   - Add a title and description
   - Click "Add Task"

3. **Manage tasks:**
   - View all your tasks
   - Delete tasks using the "Delete" button

## 🔍 Verify Services

Check if all services are running:

```powershell
# Gateway
curl http://localhost:5000/health

# Auth Service
curl http://localhost:5001/health

# Task Service
curl http://localhost:5002/health
```

## 🛑 Stop Services

```powershell
docker-compose down
```

## 📊 View Logs

```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs gateway
docker-compose logs auth-service
docker-compose logs task-service
docker-compose logs frontend
```

## 🔧 Development Mode

To run services individually without Docker:

```powershell
# Terminal 1 - Auth Service
cd auth-service; npm install; npm start

# Terminal 2 - Task Service
cd task-service; npm install; npm start

# Terminal 3 - Gateway
cd gateway; npm install; npm start

# Terminal 4 - Frontend
cd frontend; npm install; npm start
```

## ⚠️ Important Notes

- The `backend` folder is the old service - you can delete it
- All services now communicate through the Gateway (port 5000)
- JWT_SECRET must match in auth-service and task-service
- Frontend connects only to the Gateway, not directly to services

## 🎯 Next Steps

1. Configure GitHub Secrets for CI/CD:
   - DOCKER_USERNAME
   - DOCKER_PASSWORD

2. Update JWT_SECRET in production:
   - auth-service/.env
   - task-service/.env

3. Add a real database (MongoDB, PostgreSQL)

4. Implement additional features:
   - Task editing
   - Task status updates
   - User profile management
   - Task filtering and search

Enjoy building! 🎉
