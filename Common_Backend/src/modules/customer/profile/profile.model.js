const connection = require("../../../config/db");
const getProfileModel = (customer_id, cbfn) => connection.query("SELECT customer_id, customer_name, email, mobile_number, city, address, account_status, created_at FROM customers WHERE customer_id = ?", [customer_id], cbfn);
const updateProfileModel = (customer_id, data, cbfn) => connection.query("UPDATE customers SET customer_name = ?, mobile_number = ?, city = ?, address = ? WHERE customer_id = ?", [data.customer_name, data.mobile_number, data.city || null, data.address || null, customer_id], cbfn);
module.exports = { getProfileModel, updateProfileModel };
