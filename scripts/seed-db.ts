import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { Database } from '../src/types/supabase';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Create demo company
    console.log('Creating demo company...');
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .upsert({
        name: 'Demo Company',
        subdomain: 'demo',
        plan: 'PRO',
        status: 'ACTIVE',
        max_users: 10
      })
      .select()
      .single();

    if (companyError) {
      throw companyError;
    }

    console.log('Company created:', company.id);

    // Create admin user
    console.log('Creating admin user...');
    const { data: { user }, error: userError } = await supabase.auth.admin.createUser({
      email: process.env.AUTH_ADMIN_EMAIL!,
      password: process.env.AUTH_ADMIN_PASSWORD!,
      email_confirm: true,
      user_metadata: {
        name: 'Demo Admin',
        role: 'ADMIN',
        company_id: company.id
      }
    });

    if (userError || !user) {
      throw userError || new Error('Failed to create user');
    }

    console.log('Admin user created:', user.id);

    // Create demo customer
    console.log('Creating demo customer...');
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        company_id: company.id,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        preferred_contact: 'PHONE'
      })
      .select()
      .single();

    if (customerError) {
      throw customerError;
    }

    console.log('Customer created:', customer.id);

    // Create demo machine
    console.log('Creating demo machine...');
    const { data: machine, error: machineError } = await supabase
      .from('machines')
      .upsert({
        company_id: company.id,
        customer_id: customer.id,
        model: 'SRX',
        serial_number: 'SRX123456',
        purchase_date: new Date().toISOString(),
        condition: 'GOOD'
      })
      .select()
      .single();

    if (machineError) {
      throw machineError;
    }

    console.log('Machine created:', machine.id);

    // Create demo work order
    console.log('Creating demo work order...');
    const { data: workOrder, error: workOrderError } = await supabase
      .from('work_orders')
      .upsert({
        company_id: company.id,
        customer_id: customer.id,
        machine_id: machine.id,
        technician_id: user.id,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        service_type: 'MAINTENANCE',
        reported_issue: 'Regular maintenance check',
        labor_time: 1,
        labor_rate: 85
      })
      .select()
      .single();

    if (workOrderError) {
      throw workOrderError;
    }

    console.log('Work order created:', workOrder.id);
    console.log('Database seeding completed successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();