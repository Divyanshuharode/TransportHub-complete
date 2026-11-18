const connection = require("../../../config/db");

const getUserByEmailModel = (email, cbfn) => {
    const query = "SELECT DISTINCT u.* FROM users u JOIN role_assign ra ON ra.user_id = u.user_id JOIN roles r ON r.role_id = ra.role_id WHERE u.email = ? AND r.role_name IN ('SUPER_ADMIN','ADMIN','OPERATIONS')";
    connection.query(query, [email], cbfn);
};

module.exports = { getUserByEmailModel };
