import { supabase } from './supabase-client';
import { WorkOrder } from '@/types/workOrder';

class Api {
  private companyId: string;

  constructor() {
    this.companyId = localStorage.getItem('companyId') || '';
    
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.user_metadata?.company_id) {
        this.companyId = session.user.user_metadata.company_id;
        localStorage.setItem('companyId', this.companyId);
      }
    });
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    if (!this.companyId) {
      throw new Error('No company ID found');
    }

    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          customer:customers(*),
          machine:machines(*),
          technician:users(*),
          parts(*),
          photos(*)
        `)
        .eq('company_id', this.companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching work orders:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getWorkOrders:', error);
      throw error;
    }
  }

  async getWorkOrder(id: string): Promise<WorkOrder> {
    if (!this.companyId) {
      throw new Error('No company ID found');
    }

    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        customer:customers(*),
        machine:machines(*),
        technician:users(*),
        parts(*),
        photos(*)
      `)
      .eq('id', id)
      .eq('company_id', this.companyId)
      .single();

    if (error) throw error;
    return data;
  }

  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    if (!this.companyId) {
      throw new Error('No company ID found');
    }

    // Create customer if needed
    let customerId = data.customer?.id;
    if (!customerId && data.customer) {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          ...data.customer,
          company_id: this.companyId
        })
        .select()
        .single();

      if (customerError) throw customerError;
      customerId = customer.id;
    }

    // Create machine if needed
    let machineId = data.machine?.id;
    if (!machineId && data.machine && customerId) {
      const { data: machine, error: machineError } = await supabase
        .from('machines')
        .insert({
          ...data.machine,
          customer_id: customerId,
          company_id: this.companyId
        })
        .select()
        .single();

      if (machineError) throw machineError;
      machineId = machine.id;
    }

    // Create work order
    const { data: workOrder, error } = await supabase
      .from('work_orders')
      .insert({
        ...data,
        customer_id: customerId,
        machine_id: machineId,
        company_id: this.companyId
      })
      .select(`
        *,
        customer:customers(*),
        machine:machines(*),
        technician:users(*),
        parts(*),
        photos(*)
      `)
      .single();

    if (error) throw error;
    return workOrder;
  }

  async updateWorkOrder(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    if (!this.companyId) {
      throw new Error('No company ID found');
    }

    const { data: workOrder, error } = await supabase
      .from('work_orders')
      .update(data)
      .eq('id', id)
      .eq('company_id', this.companyId)
      .select(`
        *,
        customer:customers(*),
        machine:machines(*),
        technician:users(*),
        parts(*),
        photos(*)
      `)
      .single();

    if (error) throw error;
    return workOrder;
  }

  async deleteWorkOrder(id: string): Promise<void> {
    if (!this.companyId) {
      throw new Error('No company ID found');
    }

    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id)
      .eq('company_id', this.companyId);

    if (error) throw error;
  }
}