const connection = require("../../../config/db");

const getProfileModel = (transporterId, cbfn) => connection.query(`SELECT transporter_id, transporter_name, email, mobile_number, business_name, business_address, city, account_status, created_at
    FROM transporters WHERE transporter_id = ?`, [transporterId], cbfn);
const updateProfileModel = (transporterId, data, cbfn) => connection.query(`UPDATE transporters SET transporter_name = ?, mobile_number = ?, business_name = ?, business_address = ?, city = ?
    WHERE transporter_id = ?`, [data.transporter_name, data.mobile_number, data.business_name || null, data.business_address || null, data.city || null, transporterId], cbfn);

module.exports = { getProfileModel, updateProfileModel };
