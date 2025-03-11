import db from '../database.js';

export default class Environment {
  static async getEnvironments() {
    return Promise.resolve([...db.data.environments])
  }
  
  static async createEnvironment(environment) {
    const now = new Date().toISOString();
    const newEnvironment = {
      ...environment,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now
    };
    db.data.environments.push(newEnvironment);
    db.write();
    return newEnvironment;
  }

  static async updateEnvironment(environmentId, updates) {
    const environment = db.data.environments.find(e => e.id === environmentId);
    if (!environment) {
      throw new Error('Environment not found');
    }
    Object.assign(environment, updates);
    db.write();
    return environment;
  }

  static async deleteEnvironment(environmentId) {
    // Delete all customers in this environment
    db.data.customers = db.data.customers.filter(c => c.environment_id !== environmentId);
    
    // Delete all environment values
    db.data.values = db.data.values.filter(v => 
      !(v.level === 'environment' && v.entity_id === environmentId)
    );

    // Delete the environment
    const index = db.data.environments.findIndex(e => e.id === environmentId);
    if (index !== -1) {
      db.data.environments.splice(index, 1);
      db.write();
      return true;
    }

    db.write();
    return false;
  }
}