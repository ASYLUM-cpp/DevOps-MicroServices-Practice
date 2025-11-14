import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Gateway - Secure MERN Microservices 🚀',
    endpoints: {
      auth: '/api/auth/*',
      tasks: '/api/tasks/*',
      health: '/health'
    }
  });
});

// Proxy configuration for auth service
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth',
  },
  onError: (err, req, res) => {
    console.error('Auth service proxy error:', err.message);
    res.status(503).json({ 
      error: 'Auth service unavailable',
      message: 'Please try again later'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway] Proxying ${req.method} ${req.path} -> Auth Service`);
  }
}));

// Proxy configuration for task service
app.use('/api/tasks', createProxyMiddleware({
  target: process.env.TASK_SERVICE_URL || 'http://localhost:5002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/tasks': '/api/tasks',
  },
  onError: (err, req, res) => {
    console.error('Task service proxy error:', err.message);
    res.status(503).json({ 
      error: 'Task service unavailable',
      message: 'Please try again later'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway] Proxying ${req.method} ${req.path} -> Task Service`);
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
  console.log(`   Auth Service: ${process.env.AUTH_SERVICE_URL || 'http://localhost:5001'}`);
  console.log(`   Task Service: ${process.env.TASK_SERVICE_URL || 'http://localhost:5002'}`);
});
