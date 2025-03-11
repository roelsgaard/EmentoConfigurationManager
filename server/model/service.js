import db from "../database.js";

export default class Service {
    static async getServices() {
        return Promise.resolve([...db.data.services]);
    }

    static async createService(service) {
        const now = new Date().toISOString();
        const newService = {
            ...service,
            id: Math.random().toString(36).substr(2, 9),
            created_at: now,
        };
        db.data.services.push(newService);
        db.write();
        return newService;
    }

    static async updateService(serviceId, updates) {
        const service = db.data.services.find((s) => s.id === serviceId);
        if (!service) {
            throw new Error("Service not found");
        }
        Object.assign(service, updates);
        db.write();
        return service;
    }

    static async deleteService(serviceId) {
        // Delete all variables in this service
        const variableIds = db.data.variables.filter((v) => v.service_id === serviceId).map((v) => v.id);

        // Delete all values for these variables
        db.data.values = db.data.values.filter((v) => !variableIds.includes(v.variable_id));

        // Delete the variables
        db.data.variables = db.data.variables.filter((v) => v.service_id !== serviceId);

        // Delete the service
        const index = db.data.services.findIndex((s) => s.id === serviceId);
        if (index !== -1) {
            db.data.services.splice(index, 1);
            db.write();
            return true;
        }

        db.write();
        return false;
    }

    static async getServiceByRootPath(rootPath) {
        return db.data.services.find((s) => s.root_path === rootPath) || null;
    }
}
