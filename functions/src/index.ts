<content>import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// Email configuration
const transporter = nodemailer.createTransport({
  host: functions.config().smtp.host,
  port: 587,
  secure: false,
  auth: {
    user: functions.config().smtp.user,
    pass: functions.config().smtp.pass,
  },
});

// Notify customer when work order status changes
export const onWorkOrderStatusChange = functions.firestore
  .document('work_orders/{workOrderId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    if (newData.status === previousData.status) {
      return null; // Status hasn't changed
    }

    try {
      // Get customer data
      const customerDoc = await db.collection('customers').doc(newData.customerId).get();
      const customer = customerDoc.data();

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Send email notification
      await transporter.sendMail({
        from: functions.config().smtp.from,
        to: customer.email,
        subject: `Work Order #${context.params.workOrderId} Status Update`,
        html: `
          <h2>Work Order Status Update</h2>
          <p>Your work order status has been updated to: ${newData.status}</p>
          <p>View details: ${functions.config().app.url}/work-orders/${context.params.workOrderId}</p>
        `,
      });

      // Log notification
      await db.collection('notifications').add({
        type: 'work_order_status',
        workOrderId: context.params.workOrderId,
        customerId: customer.id,
        status: newData.status,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  });

// Clean up old work order photos
export const cleanupOldPhotos = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      // Get completed work orders older than 30 days
      const snapshot = await db.collection('work_orders')
        .where('status', '==', 'completed')
        .where('updatedAt', '<=', thirtyDaysAgo)
        .get();

      for (const doc of snapshot.docs) {
        const workOrder = doc.data();
        
        // Delete photos from storage
        if (workOrder.photos) {
          for (const photo of workOrder.photos) {
            await storage.bucket().file(photo.path).delete();
          }
        }

        // Update work order document
        await doc.ref.update({
          photos: [],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      console.log(`Cleaned up photos for ${snapshot.size} work orders`);
      return null;
    } catch (error) {
      console.error('Error cleaning up photos:', error);
      throw error;
    }
  });

// Generate daily reports
export const generateDailyReports = functions.pubsub
  .schedule('every day 23:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Get all companies
      const companiesSnapshot = await db.collection('companies').get();

      for (const companyDoc of companiesSnapshot.docs) {
        const company = companyDoc.data();

        // Get today's work orders for this company
        const workOrdersSnapshot = await db.collection('work_orders')
          .where('companyId', '==', companyDoc.id)
          .where('createdAt', '>=', today)
          .get();

        // Generate report data
        const reportData = {
          companyId: companyDoc.id,
          date: today,
          totalWorkOrders: workOrdersSnapshot.size,
          completed: 0,
          inProgress: 0,
          revenue: 0,
        };

        workOrdersSnapshot.docs.forEach(doc => {
          const workOrder = doc.data();
          if (workOrder.status === 'completed') reportData.completed++;
          if (workOrder.status === 'inProgress') reportData.inProgress++;
          
          // Calculate revenue
          const partsTotal = (workOrder.parts || [])
            .reduce((sum: number, part: any) => sum + (part.price * part.quantity), 0);
          const laborTotal = workOrder.laborTime * workOrder.laborRate;
          reportData.revenue += partsTotal + laborTotal;
        });

        // Save report
        await db.collection('reports').add({
          ...reportData,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Send report email to company admin
        const adminSnapshot = await db.collection('users')
          .where('companyId', '==', companyDoc.id)
          .where('role', '==', 'ADMIN')
          .get();

        if (!adminSnapshot.empty) {
          const admin = adminSnapshot.docs[0].data();
          await transporter.sendMail({
            from: functions.config().smtp.from,
            to: admin.email,
            subject: `Daily Report - ${today.toLocaleDateString()}`,
            html: `
              <h2>Daily Report</h2>
              <p>Date: ${today.toLocaleDateString()}</p>
              <ul>
                <li>Total Work Orders: ${reportData.totalWorkOrders}</li>
                <li>Completed: ${reportData.completed}</li>
                <li>In Progress: ${reportData.inProgress}</li>
                <li>Revenue: $${reportData.revenue.toFixed(2)}</li>
              </ul>
            `,
          });
        }
      }

      return null;
    } catch (error) {
      console.error('Error generating daily reports:', error);
      throw error;
    }
  });

// Handle user deletion
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  try {
    // Get user's company ID
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      console.log('No user data found for deleted user');
      return null;
    }

    // Update company user count
    await db.collection('companies').doc(userData.companyId).update({
      userCount: admin.firestore.FieldValue.increment(-1),
    });

    // Delete user document
    await userDoc.ref.delete();

    // Log user deletion
    await db.collection('audit_logs').add({
      type: 'user_deleted',
      userId: user.uid,
      companyId: userData.companyId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  } catch (error) {
    console.error('Error handling user deletion:', error);
    throw error;
  }
});</content>