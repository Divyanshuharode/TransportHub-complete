const { listDocuments, reviewDocument } = require("./document.model");
function getDocuments(req, res, next) { listDocuments((err, rows) => err ? next(err) : res.json({ success: true, data: rows })); }
function setDocumentStatus(req, res, next) {
    const status = String(req.body.status || "").toUpperCase();
    const note = String(req.body.rejection_note || "").trim();
    if (!["VERIFIED", "REJECTED"].includes(status)) return res.status(400).json({ success: false, message: "Choose VERIFIED or REJECTED" });
    if (status === "REJECTED" && !note) return res.status(400).json({ success: false, message: "A rejection reason is required" });
    reviewDocument(req.params.document_id, status, note, (err, result) => err ? next(err) : !result.affectedRows ? res.status(404).json({ success: false, message: "Document not found" }) : res.json({ success: true, message: `Document ${status.toLowerCase()}` }));
}
module.exports = { getDocuments, setDocumentStatus };

