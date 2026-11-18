const express = require("express");
const { randomUUID } = require("crypto");
const connection = require("../../../config/db");

const router = express.Router();
const db = connection.promise();
router.get("/api/admin/inventory", async (req, res, next) => {
    try { const [rows] = await db.query("SELECT item_id AS id, name, category, quantity, unit, location FROM inventory_items ORDER BY created_at DESC"); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.get("/api/admin/vehicles", async (req, res, next) => {
    try { const [rows] = await db.query(`SELECT v.vehicle_id AS id, v.vehicle_type AS type, v.vehicle_number AS registration, v.capacity, v.status, t.transporter_name AS transporter, t.city AS location FROM vehicles v JOIN transporters t ON t.transporter_id = v.transporter_id ORDER BY v.created_at DESC`); res.json({ success: true, data: rows }); } catch (error) { next(error); }
});
router.post("/api/admin/inventory", async (req, res, next) => {
    const { name, category, quantity, unit, location } = req.body;
    if (!name || !category || !unit || !location || !Number.isFinite(Number(quantity)) || Number(quantity) < 0) return res.status(400).json({ success: false, message: "Enter valid item details and quantity" });
    try { const id = randomUUID(); await db.query("INSERT INTO inventory_items (item_id, name, category, quantity, unit, location) VALUES (?, ?, ?, ?, ?, ?)", [id, name.trim(), category.trim(), quantity, unit.trim(), location.trim()]); res.status(201).json({ success: true, data: { id, name, category, quantity: Number(quantity), unit, location } }); } catch (error) { next(error); }
});
router.put("/api/admin/inventory/:id", async (req, res, next) => {
    const { name, category, quantity, unit, location } = req.body;
    if (!name || !category || !unit || !location || !Number.isFinite(Number(quantity)) || Number(quantity) < 0) return res.status(400).json({ success: false, message: "Enter valid item details and quantity" });
    try { const [result] = await db.query("UPDATE inventory_items SET name = ?, category = ?, quantity = ?, unit = ?, location = ? WHERE item_id = ?", [name.trim(), category.trim(), quantity, unit.trim(), location.trim(), req.params.id]); if (!result.affectedRows) return res.status(404).json({ success: false, message: "Inventory item not found" }); res.json({ success: true }); } catch (error) { next(error); }
});
router.delete("/api/admin/inventory/:id", async (req, res, next) => {
    try { const [result] = await db.query("DELETE FROM inventory_items WHERE item_id = ?", [req.params.id]); if (!result.affectedRows) return res.status(404).json({ success: false, message: "Inventory item not found" }); res.json({ success: true }); } catch (error) { next(error); }
});
module.exports = router;
