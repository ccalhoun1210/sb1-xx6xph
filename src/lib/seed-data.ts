import { supabaseAdmin } from './supabase-admin';

export async function seedDatabase() {
  try {
    // Create demo company
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .upsert({
        id: 'demo-company',
        name: 'Demo Company',
        subdomain: 'demo',
        plan: 'PRO',
        status: 'ACTIVE',
        max_users: 10
      })
      .select()
      .single();

    if (companyError) throw companyError;

    // Create demo admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Demo Admin',
        role: 'ADMIN',
        company_id: company.id
      }
    });

    if (adminError) throw adminError;

    // Create demo customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert({
        id: 'demo-customer',
        company_id: company.id,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        preferred_contact: 'PHONE'
      })
      .select()
      .single();

    if (customerError) throw customerError;

    // Create demo machine
    const { data: machine, error: machineError } = await supabaseAdmin
      .from('machines')
      .upsert({
        id: 'demo-machine',
        company_id: company.id,
        customer_id: customer.id,
        model: 'SRX',
        serial_number: 'SRX123456',
        purchase_date: new Date().toISOString(),
        condition: 'GOOD'
      })
      .select()
      .single();

    if (machineError) throw machineError;

    // Create demo work order
    const { error: workOrderError } = await supabaseAdmin
      .from('work_orders')
      .upsert({
        company_id: company.id,
        customer_id: customer.id,
        machine_id: machine.id,
        technician_id: adminUser.user.id,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        service_type: 'MAINTENANCE',
        reported_issue: 'Regular maintenance check',
        labor_time: 1,
        labor_rate: 85
      });

    if (workOrderError) throw workOrderError;

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}