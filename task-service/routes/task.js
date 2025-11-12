import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock task database
const tasks = [];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all tasks for the authenticated user
router.get('/', verifyToken, (req, res) => {
  const userTasks = tasks.filter(task => task.userId === req.user.id);
  res.json({ tasks: userTasks });
});

// Get a specific task
router.get('/:id', verifyToken, (req, res) => {
  const task = tasks.find(
    t => t.id === parseInt(req.params.id) && t.userId === req.user.id
  );

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ task });
});

// Create a new task
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = {
      id: tasks.length + 1,
      userId: req.user.id,
      title,
      description: description || '',
      status: status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tasks.push(task);

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task
router.put('/:id', verifyToken, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(
      t => t.id === parseInt(req.params.id) && t.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, status } = req.body;

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      updatedAt: new Date()
    };

    res.json({
      message: 'Task updated successfully',
      task: tasks[taskIndex]
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(
      t => t.id === parseInt(req.params.id) && t.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
