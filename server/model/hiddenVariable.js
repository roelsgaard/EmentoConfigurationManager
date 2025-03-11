import db from "../database.js";

export default class HiddenVariable {
    static async getHiddenVariables() {
        return Promise.resolve([...db.data.hiddenVariables]);
    }

    static async setVariableHidden(variableId, level, entityId, hidden) {
        const existingIndex = db.data.hiddenVariables.findIndex(
            (h) => h.variable_id === variableId && h.level === level && h.entity_id === entityId,
        );

        if (hidden) {
            if (existingIndex === -1) {
                db.data.hiddenVariables.push({
                    variable_id: variableId,
                    level,
                    entity_id: entityId,
                });
            }
        } else {
            if (existingIndex !== -1) {
                db.data.hiddenVariables.splice(existingIndex, 1);
            }
        }

        db.write();
        return true;
    }
}
