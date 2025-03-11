import express from "express";
const router = express.Router();
import HiddenVariable from "../../model/hiddenVariable.js";

// Hidden Variables
router.get("/", async (req, res) => {
    const hiddenVariables = await HiddenVariable.getHiddenVariables();
    res.json(hiddenVariables);
});

router.post("/", async (req, res) => {
    const { variableId, level, entityId, hidden } = req.body;
    await HiddenVariable.setVariableHidden(variableId, level, entityId, hidden);
    res.status(200).json({ success: true });
});

export default router;
