import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth';
import { prisma } from '../config/database';
import { z } from 'zod';

const router = Router();

const workOrderSchema = z.object({
  status: z.enum(['scheduled', 'inProgress', 'awaitingParts', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  serviceType: z.enum(['maintenance', 'repair', 'warranty']),
  customerId: z.string(),
  machineId: z.string(),
  technicianId: z.string().optional(),
  reportedIssue: z.string(),
  laborTime: z.number().min(0),
  laborRate: z.number().min(0),
});

// Get all work orders
router.get('/', auth, async (req, res) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        customer: true,
        machine: true,
        technician: true,
        parts: true,
        photos: true,
      },
    });
    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch work orders' });
  }
});

// Get work order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        machine: true,
        technician: true,
        parts: true,
        photos: true,
      },
    });
    
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch work order' });
  }
});

// Create work order
router.post('/', auth, async (req, res) => {
  try {
    const data = workOrderSchema.parse(req.body);
    
    const workOrder = await prisma.workOrder.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        machine: true,
        technician: true,
      },
    });
    
    res.status(201).json(workOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create work order' });
  }
});

// Update work order
router.put('/:id', auth, async (req, res) => {
  try {
    const data = workOrderSchema.partial().parse(req.body);
    
    const workOrder = await prisma.workOrder.update({
      where: { id: req.params.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        machine: true,
        technician: true,
      },
    });
    
    res.json(workOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update work order' });
  }
});

// Delete work order
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await prisma.workOrder.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete work order' });
  }
});

export default router;