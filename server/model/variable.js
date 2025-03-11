import db from '../database.js';

export default class Variable {
  static async getVariables() {
    return Promise.resolve([...db.data.variables])
  }
  
  static async createVariable(variable) {
    const now = new Date().toISOString();
    const newVariable = {
      ...variable,
      id: Math.random().toString(36).substr(2, 9),
      created_at: now,
      updated_at: now
    };
    db.data.variables.push(newVariable);
    db.write();
    return newVariable;
  }

  static async updateVariable(variableId, updates) {
    const variable = db.data.variables.find(v => v.id === variableId);
    if (!variable) {
      throw new Error('Variable not found');
    }
    Object.assign(variable, updates, {
      updated_at: new Date().toISOString()
    });
    db.write();
    return variable;
  }

  static async deleteVariable(variableId) {
    // Remove the variable
    const index = db.data.variables.findIndex(v => v.id === variableId);
    if (index !== -1) {
      db.data.variables.splice(index, 1);
      
      // Remove all associated values
      db.data.values = db.data.values.filter(v => v.variable_id !== variableId);
      
      db.write();
      return true;
    }
    return false;
  }
}