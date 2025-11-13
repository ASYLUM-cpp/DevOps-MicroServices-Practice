# Contributing Guide

Thank you for your interest in contributing to this project! This guide will help you get started.

## 🚀 Quick Start (With Docker - Recommended)

### Prerequisites
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac/Linux)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ASYLUM-cpp/DevOps-MicroServices-Practice.git
   cd DevOps-MicroServices-Practice
   ```

2. **Start Docker Desktop**
   - Open Docker Desktop application
   - Wait until it's fully running (check system tray/menu bar)

3. **Run the project**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Gateway API: http://localhost:5000
   - Auth Service: http://localhost:5001
   - Task Service: http://localhost:5002

5. **Stop the application**
   - Press `Ctrl+C` in the terminal
   - Or run: `docker-compose down`

### First Time Setup
The first run will take 2-3 minutes because Docker needs to:
- Download Node.js base images (~150MB)
- Install all npm dependencies for each service
- Build all containers

**Subsequent runs take only ~10 seconds** because everything is cached!

---

## 💻 Alternative: Running Without Docker (Local Development)

If you prefer to run services individually for development:

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ASYLUM-cpp/DevOps-MicroServices-Practice.git
   cd DevOps-MicroServices-Practice
   ```

2. **Install dependencies for each service**
   ```bash
   # Auth Service
   cd auth-service
   npm install
   
   # Task Service
   cd ../task-service
   npm install
   
   # Gateway
   cd ../gateway
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Start each service in separate terminals**

   **Terminal 1 - Auth Service:**
   ```bash
   cd auth-service
   npm start
   ```
   
   **Terminal 2 - Task Service:**
   ```bash
   cd task-service
   npm start
   ```
   
   **Terminal 3 - Gateway:**
   ```bash
   cd gateway
   npm start
   ```
   
   **Terminal 4 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - All services will communicate via localhost

### Environment Variables (Local Development)

When running locally, update the `.env` files:

**Gateway `.env`:**
```env
PORT=5000
AUTH_SERVICE_URL=http://localhost:5001
TASK_SERVICE_URL=http://localhost:5002
NODE_ENV=development
```

**Auth Service `.env`:**
```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Task Service `.env`:**
```env
PORT=5002
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

---

## 🔧 Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit code in any service
   - Test locally

3. **Test with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Describe your changes

### Hot Reload (For faster development)

**With Docker:** By default, you need to rebuild. To enable hot reload, add volumes to docker-compose.yml:

```yaml
services:
  frontend:
    volumes:
      - ./frontend/src:/app/src
```

**Without Docker:** Changes are automatically picked up when running with `npm start`

---

## 📁 Project Structure

```
DevOps-MicroServices-Practice/
├── auth-service/          # Authentication microservice
│   ├── routes/            # Auth routes (login, register)
│   ├── server.js          # Express server
│   ├── Dockerfile         # Container definition
│   └── package.json       # Dependencies
│
├── task-service/          # Task management microservice
│   ├── routes/            # Task CRUD routes
│   ├── server.js          # Express server
│   ├── Dockerfile         # Container definition
│   └── package.json       # Dependencies
│
├── gateway/               # API Gateway
│   ├── server.js          # Proxy server
│   ├── Dockerfile         # Container definition
│   └── package.json       # Dependencies
│
├── frontend/              # React frontend
│   ├── src/               # React components
│   ├── public/            # Static files
│   ├── Dockerfile         # Container definition
│   └── package.json       # Dependencies
│
├── .github/workflows/     # CI/CD pipeline
│   └── ci.yml             # GitHub Actions workflow
│
├── docker-compose.yml     # Multi-container orchestration
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

---

## 🧪 Testing the Application

### Manual Testing

1. **Start the application** (Docker or local)

2. **Test Authentication:**
   - Open http://localhost:3000
   - Click "Register"
   - Enter: username, email, password
   - You should be logged in automatically

3. **Test Task Management:**
   - Create a new task
   - View your tasks
   - Delete a task

4. **Test API Directly:**
   ```bash
   # Health checks
   curl http://localhost:5000/health
   curl http://localhost:5001/health
   curl http://localhost:5002/health
   
   # Register user
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@example.com","password":"password123"}'
   ```

---

## 🐛 Troubleshooting

### Docker Issues

**Problem:** `docker-compose` command not found
- **Solution:** Install Docker Desktop and ensure it's running

**Problem:** "Cannot connect to Docker daemon"
- **Solution:** Start Docker Desktop application

**Problem:** Port already in use (e.g., port 3000, 5000)
- **Solution:** Stop other applications using those ports, or change ports in docker-compose.yml

**Problem:** Containers won't start
- **Solution:** 
  ```bash
  docker-compose down
  docker system prune -a
  docker-compose up --build
  ```

### Local Development Issues

**Problem:** "Cannot find module" errors
- **Solution:** Run `npm install` in the specific service directory

**Problem:** Services can't communicate
- **Solution:** Check that all services are running and using correct ports

**Problem:** CORS errors
- **Solution:** Ensure frontend is accessing http://localhost:5000 (gateway), not services directly

---

## 📝 Environment Variables

Create `.env` files in each service directory (these are git-ignored):

### Auth Service (.env)
```env
PORT=5001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Task Service (.env)
```env
PORT=5002
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Gateway (.env)
```env
PORT=5000
AUTH_SERVICE_URL=http://auth-service:5001
TASK_SERVICE_URL=http://task-service:5002
NODE_ENV=development
```

**⚠️ Important:** For local development without Docker, change service URLs to `localhost` instead of service names.

---

## 🔒 Security Notes

- `.env` files are git-ignored for security
- Never commit API keys, passwords, or secrets
- Change `JWT_SECRET` in production
- Use strong passwords for user accounts

---

## 💡 Tips

1. **Use Docker for consistency** - Same environment as production
2. **Use local development for speed** - Faster iteration when coding
3. **Test both ways** - Ensure it works in both environments
4. **Check logs** - Use `docker-compose logs [service-name]` for debugging

---

## 🤝 Contributing Guidelines

1. **Fork** the repository
2. **Clone** your fork
3. **Create a branch** for your feature
4. **Make changes** and test thoroughly
5. **Commit** with clear messages
6. **Push** to your fork
7. **Submit a Pull Request**

### Code Style
- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issues when applicable

---

## 📞 Need Help?

- Create an [Issue](https://github.com/ASYLUM-cpp/DevOps-MicroServices-Practice/issues)
- Check existing issues for solutions
- Read the [README.md](README.md) for project overview

---

## 📄 License

MIT License - Feel free to use this project for learning and development!
