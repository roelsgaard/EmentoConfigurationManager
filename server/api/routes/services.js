import express from "express";
const router = express.Router();
import Service from "../../model/service.js";

// Services
router.get("/", async (req, res) => {
    const services = await Service.getServices();
    res.json(services);
});

router.post("/", async (req, res) => {
    const service = await Service.createService(req.body);
    res.status(201).json(service);
});

router.put("/:id", async (req, res) => {
    const service = await Service.updateService(req.params.id, req.body);
    res.json(service);
});

router.delete("/:id", async (req, res) => {
    await Service.deleteService(req.params.id);
    res.status(204).send();
});

export default router;
