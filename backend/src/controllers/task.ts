import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { Task } from '../entities/Task';

const taskRepository = AppDataSource.getRepository(Task);

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskRepository.find({
      where: { userId: req.user!.id },
      order: { id: 'DESC' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const task = taskRepository.create({
      title,
      description,
      userId: req.user!.id
    });
    await taskRepository.save(task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskRepository.findOne({
      where: { id: parseInt(id), userId: req.user!.id }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    Object.assign(task, req.body);
    await taskRepository.save(task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskRepository.findOne({
      where: { id: parseInt(id), userId: req.user!.id }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await taskRepository.remove(task);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};