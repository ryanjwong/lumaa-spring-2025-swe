import { Request, Response } from 'express';
import { DataService } from '../services/data';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const tasks = DataService.getInstance().getTasks(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, description } = req.body;
    const task = DataService.getInstance().createTask({
      title,
      description,
      isComplete: false,
      userId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = parseInt(req.params.id);
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const updates = req.body;
    const updatedTask = DataService.getInstance().updateTask(taskId, userId, updates);
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = parseInt(req.params.id);
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const success = DataService.getInstance().deleteTask(taskId, userId);
    if (!success) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};