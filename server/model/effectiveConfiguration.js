import db from "../database.js";
import set from "lodash.set";

// Helper function to check if a value is effectively empty based on its type
const isValueEmpty = (value, type) => {
    if (value === undefined || value === null) return true;

    switch (type) {
        case "string":
            return value === "";
        case "array":
            return Array.isArray(value) && value.length === 0;
        case "object":
            return Object.keys(value).length === 0;
        default:
            return false;
    }
};

// Helper function to check if a variable has a value set at any level
const hasValueAtAnyLevel = (variable, values, level, entityId, environmentId = null) => {
    // Get the most specific value that applies
    let effectiveValue = variable.defaultValue;

    // Check global level
    const globalValue = values.find((v) => v.variable_id === variable.id && v.level === "global");
    if (globalValue) {
        effectiveValue = globalValue.value;
    }

    // If we're at customer level, also check environment level
    if (level === "customer" && environmentId) {
        const environmentValue = values.find(
            (v) => v.variable_id === variable.id && v.level === "environment" && v.entity_id === environmentId,
        );
        if (environmentValue) {
            effectiveValue = environmentValue.value;
        }
    }

    // Check current level
    if (level && entityId) {
        const currentLevelValue = values.find(
            (v) => v.variable_id === variable.id && v.level === level && v.entity_id === entityId,
        );
        if (currentLevelValue) {
            effectiveValue = currentLevelValue.value;
        }
    }

    // Check if the effective value is empty
    return !isValueEmpty(effectiveValue, variable.type);
};

// Helper function to check if a variable is hidden
const isVariableHidden = (variable, hiddenVariables, level, entityId) => {
    return hiddenVariables.some((h) => h.variable_id === variable.id && h.level === level && h.entity_id === entityId);
};

// Helper function to validate configuration
const validateConfiguration = (variables, values, hiddenVariables, level, entityId) => {
    if (level !== "customer") return { isValid: true, missingVariables: [] };

    const customer = db.data.customers.find((c) => c.id === entityId);
    if (!customer) return { isValid: false, missingVariables: [] };

    const missingVariables = variables.filter((variable) => {
        const hasValue = hasValueAtAnyLevel(variable, values, level, entityId, customer.environment_id);
        const isHidden = isVariableHidden(variable, hiddenVariables, level, entityId);
        return !hasValue && !isHidden;
    });

    return {
        isValid: missingVariables.length === 0,
        missingVariables,
    };
};

// Helper function to build effective configuration
const buildEffectiveConfiguration = (variables, values, level = null, entityId = null, serviceId = null) => {
    let config = {};

    // Filter variables by service if specified
    const filteredVariables = serviceId ? variables.filter((v) => v.service_id === serviceId) : variables;

    // If we're looking up customer config, find its environment
    let environmentId = null;
    if (level === "customer") {
        const customer = db.data.customers.find((c) => c.id === entityId);
        if (customer) {
            environmentId = customer.environment_id;
        }
    }

    // Get hidden variables for this context
    const hiddenVariableIds = new Set(
        db.data.hiddenVariables.filter((h) => h.level === level && h.entity_id === entityId).map((h) => h.variable_id),
    );

    filteredVariables.forEach((variable) => {
        // Skip if variable is hidden in this context
        if (hiddenVariableIds.has(variable.id)) {
            return;
        }

        let effectiveValue = variable.defaultValue;

        // Find global override
        const globalValue = values.find((v) => v.variable_id === variable.id && v.level === "global");
        if (globalValue) {
            effectiveValue = globalValue.value;
        }

        // Find environment override
        if (level === "environment" || level === "customer") {
            const envValue = values.find(
                (v) =>
                    v.variable_id === variable.id &&
                    v.level === "environment" &&
                    v.entity_id === (level === "customer" ? environmentId : entityId),
            );
            if (envValue) {
                effectiveValue = envValue.value;
            }
        }

        // Find customer override
        if (level === "customer") {
            const custValue = values.find(
                (v) => v.variable_id === variable.id && v.level === "customer" && v.entity_id === entityId,
            );
            if (custValue) {
                effectiveValue = custValue.value;
            }
        }

        // Get the service's root path
        const service = db.data.services.find((s) => s.id === variable.service_id);
        const rootPath = service?.root_path || "";

        // Combine root path with variable's JSON path
        const fullPath = rootPath ? `${rootPath}.${variable.jsonPath}` : variable.jsonPath;
        set(config, fullPath, effectiveValue);
    });

    // If this is a customer configuration, validate it
    if (level === "customer") {
        const validation = validateConfiguration(filteredVariables, values, db.data.hiddenVariables, level, entityId);

        if (!validation.isValid) {
            config._validation = {
                isValid: false,
                missingVariables: validation.missingVariables.map((v) => ({
                    id: v.id,
                    name: v.name,
                    jsonPath: v.jsonPath,
                    service: db.data.services.find((s) => s.id === v.service_id)?.name || "Unknown Service",
                })),
            };
        }
    }

    return config;
};

export default class EffectiveConfiguration {
    static async getEffectiveConfiguration(level = null, entityId = null, serviceId = null) {
        return buildEffectiveConfiguration(db.data.variables, db.data.values, level, entityId, serviceId);
    }

    static async validateConfiguration(variables, values, hiddenVariables, level, entityId) {
        return validateConfiguration(variables, values, hiddenVariables, level, entityId);
    }
}
