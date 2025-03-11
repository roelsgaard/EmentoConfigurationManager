import db from "../database.js";

export default class Module {
    static async getModules() {
        return Promise.resolve([...db.data.modules]);
    }

    static async createModule(module) {
        const now = new Date().toISOString();
        const newModule = {
            ...module,
            id: Math.random().toString(36).substr(2, 9),
            created_at: now,
        };
        db.data.modules.push(newModule);
        db.write();
        return newModule;
    }

    static async updateModule(moduleId, updates) {
        const module = db.data.modules.find((m) => m.id === moduleId);
        if (!module) {
            throw new Error("Module not found");
        }
        Object.assign(module, updates);
        db.write();
        return module;
    }

    static async deleteModule(moduleId) {
        const index = db.data.modules.findIndex((m) => m.id === moduleId);
        if (index !== -1) {
            db.data.modules.splice(index, 1);

            // Update variables to remove module_id
            db.data.variables.forEach((variable) => {
                if (variable.module_id === moduleId) {
                    delete variable.module_id;
                }
            });

            db.write();
            return true;
        }
        return false;
    }
}
