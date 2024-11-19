import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create demo company
    const company = await prisma.company.create({
      data: {
        name: 'Demo Company',
        subdomain: 'demo',
        plan: 'PRO',
        maxUsers: 10,
      },
    });

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        passwordHash: adminPassword,
        role: 'ADMIN',
        companyId: company.id,
      },
    });

    // Create technician
    const techPassword = await bcrypt.hash('tech123', 10);
    const technician = await prisma.user.create({
      data: {
        email: 'tech@example.com',
        name: 'John Tech',
        passwordHash: techPassword,
        role: 'TECHNICIAN',
        companyId: company.id,
      },
    });

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name: 'Jane Customer',
        email: 'jane@example.com',
        phone: '555-0123',
        preferredContact: 'PHONE',
        companyId: company.id,
      },
    });

    // Create machine
    const machine = await prisma.machine.create({
      data: {
        model: 'SRX',
        serialNumber: 'SRX123456',
        purchaseDate: new Date(),
        condition: 'GOOD',
        companyId: company.id,
        customerId: customer.id,
        attachments: {
          create: [
            {
              type: 'POWER_NOZZLE',
              serialNumber: 'PN123456',
              companyId: company.id,
            },
          ],
        },
      },
    });

    // Create work order
    await prisma.workOrder.create({
      data: {
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        serviceType: 'MAINTENANCE',
        companyId: company.id,
        customerId: customer.id,
        machineId: machine.id,
        technicianId: technician.id,
        reportedIssue: 'Regular maintenance check',
        laborTime: 1,
        laborRate: 85,
        parts: {
          create: [
            {
              name: 'HEPA Filter',
              partNumber: 'HF-001',
              price: 49.99,
              quantity: 1,
              companyId: company.id,
            },
          ],
        },
      },
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();