import { Express } from 'express';
import authRoutes from './auth';
import workOrderRoutes from './workOrders';
import customerRoutes from './customers';
import machineRoutes from './machines';
import userRoutes from './users';
import uploadRoutes from './upload';
import paymentRoutes from './payments';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/work-orders', workOrderRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/machines', machineRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/payments', paymentRoutes);
};