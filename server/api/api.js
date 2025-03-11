import express from "express";
const router = express.Router();

import modules from "./routes/modules.js";
router.use("/modules", modules);

import environments from "./routes/environments.js";
router.use("/environments", environments);

import services from "./routes/services.js";
router.use("/services", services);

import customers from "./routes/customers.js";
router.use("/customers", customers);

import variables from "./routes/variables.js";
router.use("/variables", variables);

import values from "./routes/values.js";
router.use("/values", values);

import configuration from "./routes/configuration.js";
router.use("/configuration", configuration);

import hiddenVariables from "./routes/hiddenVariables.js";
router.use("/hidden-variables", hiddenVariables);

import effectiveConfiguration from "./routes/effectiveConfiguration.js";
router.use("/effective-configuration", effectiveConfiguration);

import git from "./routes/git.js";
router.use("/git", git);

export default router;
