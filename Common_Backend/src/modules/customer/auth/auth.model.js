const connection = require("../../../config/db");

const registerCustomerModel = (data, cbfn) => connection.query("INSERT INTO customers (customer_name, email, mobile_number, password) VALUES (?, ?, ?, ?)", [data.customer_name, data.email, data.mobile_number, data.password], cbfn);
const getCustomerByEmailModel = (email, cbfn) => connection.query("SELECT customer_id, customer_name, email, mobile_number, password, account_status FROM customers WHERE email = ?", [email], cbfn);
const getCustomerByIdModel = (customer_id, cbfn) => connection.query("SELECT customer_id, customer_name, email, mobile_number, city, address, account_status, created_at FROM customers WHERE customer_id = ?", [customer_id], cbfn);
const updateCustomerProfileModel = (customer_id, data, cbfn) => connection.query("UPDATE customers SET customer_name = ?, mobile_number = ?, city = ?, address = ? WHERE customer_id = ?", [data.customer_name, data.mobile_number, data.city || null, data.address || null, customer_id], cbfn);

module.exports = { registerCustomerModel, getCustomerByEmailModel, getCustomerByIdModel, updateCustomerProfileModel };
