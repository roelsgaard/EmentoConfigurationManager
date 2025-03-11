import express from "express";
const router = express.Router();
import Module from "./../../model/module.js";

// Modules
router.get("/", async (req, res) => {
    const modules = await Module.getModules();
    res.json(modules);
});

router.post("/", async (req, res) => {
    const module = await Module.createModule(req.body);
    res.status(201).json(module);
});

router.put("/:id", async (req, res) => {
    const module = await Module.updateModule(req.params.id, req.body);
    res.json(module);
});

router.delete("/:id", async (req, res) => {
    await Module.deleteModule(req.params.id);
    res.status(204).send();
});

export default router;
