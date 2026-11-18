const generateUUID = require("../../../utility/uuid");
const { listDocuments, addDocument } = require("./document.model");
function getDocuments(req, res, next) { listDocuments(req.transporterId, (err, rows) => err ? next(err) : res.json({ success: true, data: rows })); }
function createDocument(req, res, next) {
    const document_type = String(req.body.document_type || "").trim();
    const document_number = String(req.body.document_number || "").trim();
    const file_url = String(req.body.file_url || "").trim();
    if (!document_type || !document_number) return res.status(400).json({ success: false, message: "Document type and number are required" });
    if (file_url && !/^https?:\/\//i.test(file_url)) return res.status(400).json({ success: false, message: "Document link must start with http:// or https://" });
    addDocument({ document_id: generateUUID(), transporter_id: req.transporterId, document_type, document_number, file_url: file_url || null }, (err, result) => err ? next(err) : res.status(201).json({ success: true, message: "Document submitted for verification", data: result }));
}
module.exports = { getDocuments, createDocument };

