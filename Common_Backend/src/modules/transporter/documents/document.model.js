const connection = require("../../../config/db");
const listDocuments = (transporterId, cbfn) => connection.query("SELECT document_id, document_type, document_number, file_url, status, rejection_note, uploaded_at, reviewed_at FROM transporter_documents WHERE transporter_id = ? ORDER BY uploaded_at DESC", [transporterId], cbfn);
const addDocument = (data, cbfn) => connection.query("INSERT INTO transporter_documents (document_id, transporter_id, document_type, document_number, file_url) VALUES (?, ?, ?, ?, ?)", [data.document_id, data.transporter_id, data.document_type, data.document_number, data.file_url || null], cbfn);
module.exports = { listDocuments, addDocument };

