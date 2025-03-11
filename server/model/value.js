import db from '../database.js';

export default class Value {
  static async getValues() {
    return Promise.resolve([...db.data.values])
  }

  static async updateValue(value) {
    const now = new Date().toISOString();
    
    const existingIndex = db.data.values.findIndex(v => 
      v.variable_id === value.variable_id &&
      v.level === value.level &&
      v.entity_id === value.entity_id
    );

    if (existingIndex !== -1) {
      // Update existing
      db.data.values[existingIndex] = {
        ...db.data.values[existingIndex],
        ...value,
        updated_at: now
      };
      return db.data.values[existingIndex];
    }

    // Create new
    const newValue = {
      id: Math.random().toString(36).substr(2, 9),
      variable_id: value.variable_id,
      level: value.level,
      entity_id: value.entity_id,
      value: value.value,
      created_at: now,
      updated_at: now
    };
    
    db.data.values.push(newValue);
    db.write();
    return newValue;
  }

  static async deleteValue(value) {
    const index = db.data.values.findIndex(v => 
      v.variable_id === value.variable_id &&
      v.level === value.level &&
      v.entity_id === value.entity_id
    );

    if (index !== -1) {
      db.data.values.splice(index, 1);
      db.write();
      return true;
    }
    return false;
  }
}