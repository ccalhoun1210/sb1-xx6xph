# Rainbow Service Manager

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The development environment uses mock data and services.

## Production Deployment Requirements

1. Database (Choose one):
   - PostgreSQL (recommended)
   - MySQL
   - SQL Server

2. Cloud Services:
   - AWS S3 for file storage
   - Stripe for payments
   - SendGrid/SMTP for emails
   - Twilio for SMS

3. Environment Variables:
   See `.env.example` for required variables.

## Deployment Instructions

1. Set up your database
2. Update environment variables
3. Build the application:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

## Features

- Work Order Management
- Customer Management
- Inventory Tracking
- Real-time Chat
- File Management
- Analytics Dashboard

## Support

For support, please contact:
support@yourdomain.com