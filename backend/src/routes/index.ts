import { Router } from 'express';
import { register, login } from '../controllers/auth';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/tasks';
import { auth } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Task routes (protected)
router.get('/tasks', auth, getTasks);
router.post('/tasks', auth, createTask);
router.put('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

export default router;