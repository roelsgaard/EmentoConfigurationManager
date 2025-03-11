import db from '../database.js';

export default class Customer {
  static async getCustomers() {
    return Promise.resolve([...db.data.customers])
  }
  
  static async createCustomer(customer) {
    const now = new Date().toISOString();
    const newCustomer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    db.data.customers.push(newCustomer);
    db.write();
    return newCustomer;
  }

  static async updateCustomer(customerId, updates) {
    const customer = db.data.customers.find(c => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    Object.assign(customer, updates);
    db.write();
    return customer;
  }

  static async deleteCustomer(customerId) {
    // Delete all customer values
    db.data.values = db.data.values.filter(v => 
      !(v.level === 'customer' && v.entity_id === customerId)
    );

    // Delete the customer
    const index = db.data.customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      db.data.customers.splice(index, 1);
      db.write();
      return true;
    }

    db.write();
    return false;
  }

  static async getCustomerByDomain(domain) {
    return db.data.customers.find(c => c.domain === domain) || null;
  }
}