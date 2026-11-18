const express = require("express");
const { getDocuments, setDocumentStatus } = require("./document.controller");
const router = express.Router();
router.get("/api/admin/documents", getDocuments);
router.patch("/api/admin/documents/:document_id", setDocumentStatus);
module.exports = router;

