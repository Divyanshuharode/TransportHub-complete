const express = require("express");
const { getDocuments, createDocument } = require("./document.controller");
const router = express.Router();
router.get("/api/transporter/documents", getDocuments);
router.post("/api/transporter/documents", createDocument);
module.exports = router;

