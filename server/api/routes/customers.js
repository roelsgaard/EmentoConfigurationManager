import express from "express";
const router = express.Router();
import Customer from "../../model/customer.js";

// Customers
router.get("/", async (req, res) => {
    const customers = await Customer.getCustomers();
    res.json(customers);
});

router.post("/", async (req, res) => {
    const customer = await Customer.createCustomer(req.body);
    res.status(201).json(customer);
});

router.put("/:id", async (req, res) => {
    const customer = await Customer.updateCustomer(req.params.id, req.body);
    res.json(customer);
});

router.delete("/:id", async (req, res) => {
    await Customer.deleteCustomer(req.params.id);
    res.status(204).send();
});

export default router;
