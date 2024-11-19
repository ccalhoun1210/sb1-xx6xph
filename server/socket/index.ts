import { Server } from 'socket.io';
import { jwtVerify } from 'jose';
import { prisma } from '../config/database';

export const setupSocketHandlers = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      const user = await prisma.user.findUnique({
        where: { id: payload.sub as string },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.id;
    
    socket.join(`user:${userId}`);

    socket.on('message', async (data, callback) => {
      try {
        const message = await prisma.message.create({
          data: {
            text: data.text,
            senderId: userId,
            workOrderId: data.workOrderId,
          },
          include: {
            sender: true,
          },
        });

        io.to(`workOrder:${data.workOrderId}`).emit('message', message);
        callback(null, { success: true });
      } catch (error) {
        callback(error);
      }
    });

    socket.on('typing', (data) => {
      socket.to(`workOrder:${data.workOrderId}`).emit('typing', {
        workOrderId: data.workOrderId,
        user: socket.data.user,
      });
    });

    socket.on('joinWorkOrder', (workOrderId) => {
      socket.join(`workOrder:${workOrderId}`);
    });

    socket.on('leaveWorkOrder', (workOrderId) => {
      socket.leave(`workOrder:${workOrderId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};