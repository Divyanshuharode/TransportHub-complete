const connection = require("../../../config/db");
function listDocuments(cbfn) { connection.query(`SELECT d.document_id, d.document_type, d.document_number, d.file_url, d.status, d.rejection_note, d.uploaded_at, d.reviewed_at, t.transporter_name, t.email AS transporter_email FROM transporter_documents d JOIN transporters t ON t.transporter_id = d.transporter_id ORDER BY d.uploaded_at DESC`, cbfn); }
function reviewDocument(id, status, note, cbfn) { connection.query("UPDATE transporter_documents SET status = ?, rejection_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE document_id = ?", [status, status === "REJECTED" ? note : null, id], cbfn); }
module.exports = { listDocuments, reviewDocument };

