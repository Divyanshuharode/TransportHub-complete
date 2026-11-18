const connection = require("../../../config/db");

const allTransportersModel = (cbfn) => {
    const query = "SELECT transporter_id, transporter_name, email, mobile_number, business_name, city, account_status, created_at FROM transporters ORDER BY created_at DESC";
    connection.query(query, cbfn)
}

const totalTransportersModel = (cbfn) => {
    const query = "SELECT COUNT(*) AS totaltransporter FROM transporters";
    connection.query(query, cbfn);
};

const activeTransportersModel = (cbfn) => {
    const query = "SELECT COUNT(*) AS activetransporter FROM transporters WHERE LOWER(account_status) = ?";
    connection.query(query, ["active"], cbfn);
};

const inActiveTransportersModel = (cbfn) => {
    const query = "SELECT COUNT(*) AS inActivetransporter FROM transporters WHERE LOWER(account_status) = ?";
    connection.query(query, ["inactive"], cbfn);
};

module.exports = { allTransportersModel, totalTransportersModel, activeTransportersModel, inActiveTransportersModel };
