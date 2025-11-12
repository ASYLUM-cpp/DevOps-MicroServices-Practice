# Practice DevSecOps - Microservices Architecture

A secure MERN stack application with microservices architecture, featuring authentication, task management, and an API gateway.

## 🏗️ Architecture

```
practice-devsecops/
│
├── docker-compose.yml          # Orchestrates all services
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline with security scanning
│
├── frontend/                   # React frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── public/
│       └── index.html
│
├── auth-service/               # Authentication microservice
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── routes/
│       └── auth.js             # Login, Register, Verify endpoints
│
├── task-service/               # Task management microservice
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── routes/
│       └── task.js             # CRUD operations for tasks
│
└── gateway/                    # API Gateway
    ├── Dockerfile
    ├── server.js
    ├── package.json
    └── .env                    # Routes requests to appropriate services
```

## 🚀 Services

### Gateway (Port 5000)
- API Gateway that routes requests to microservices
- Endpoints: `/api/auth/*`, `/api/tasks/*`, `/health`

### Auth Service (Port 5001)
- User authentication and authorization
- JWT token generation and verification
- Endpoints:
  - `POST /api/auth/register` - Register new user
  - `POST /api/auth/login` - Login user
  - `GET /api/auth/verify` - Verify JWT token

### Task Service (Port 5002)
- Task management with authentication
- Endpoints:
  - `GET /api/tasks` - Get all user tasks
  - `GET /api/tasks/:id` - Get specific task
  - `POST /api/tasks` - Create new task
  - `PUT /api/tasks/:id` - Update task
  - `DELETE /api/tasks/:id` - Delete task

### Frontend (Port 3000)
- React application with authentication UI
- Task management interface
- Communicates with gateway

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)

### Running with Docker Compose (Recommended)

1. **Start all services:**
   ```powershell
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Gateway: http://localhost:5000
   - Auth Service: http://localhost:5001
   - Task Service: http://localhost:5002

3. **Stop all services:**
   ```powershell
   docker-compose down
   ```

### Running Services Individually

#### Gateway
```powershell
cd gateway
npm install
npm start
```

#### Auth Service
```powershell
cd auth-service
npm install
npm start
```

#### Task Service
```powershell
cd task-service
npm install
npm start
```

#### Frontend
```powershell
cd frontend
npm install
npm start
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled
- Environment variable configuration
- Trivy security scanning in CI/CD
- Vulnerability scanning with Snyk (optional)

## 🧪 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) includes:

1. **Lint and Test** - Runs tests for all services
2. **Security Scan** - Trivy filesystem scanning
3. **Build** - Builds and pushes Docker images
4. **Image Scan** - Scans Docker images for vulnerabilities
5. **Deploy** - Deploys to production (on main branch)

### Required GitHub Secrets:
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token

## 📝 Environment Variables

### Gateway
```env
PORT=5000
AUTH_SERVICE_URL=http://auth-service:5001
TASK_SERVICE_URL=http://task-service:5002
NODE_ENV=development
```

### Auth Service
```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Task Service
```env
PORT=5002
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🧰 Tech Stack

- **Frontend:** React 18
- **Backend:** Node.js + Express
- **Authentication:** JWT + bcrypt
- **Gateway:** http-proxy-middleware
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Security:** Trivy, Snyk

## 📖 API Usage Examples

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secure123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

### Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Task","description":"Task description","status":"pending"}'
```

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Troubleshooting

### Services not connecting in Docker
- Ensure all services are on the same network (`app-network`)
- Check service names in docker-compose.yml match environment variables

### JWT errors
- Ensure `JWT_SECRET` is the same in auth-service and task-service
- Check token format: `Bearer <token>`

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` points to gateway (port 5000)
- Check CORS configuration in backend services

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
