const bcrypt = require("bcrypt");
const generateUUID = require("../../../utility/uuid");

const { getUsersModel, addUserModel, assignRoleModel, deleteUserModel, updateStatusModel, getUserByIdModel, updateUserModel } = require("./user.model");

const getusers = (req, res, next) => {
    getUsersModel((err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Users fetched successfully", data: result });
    });
};

const adduser = async (req, res, next) => {
    try {
        const user_id = generateUUID();
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const data = { user_id, full_name: req.body.full_name, email: req.body.email, password: hashPassword };

        addUserModel(data, (err, result) => {
            if (err) return next(err);

            assignRoleModel(user_id, req.body.role_id, (err) => {
                if (err) return next(err);
                res.send({ success: true, message: "User added and role assigned successfully", data: { user_id, ...result } });
            });
        });
    } catch (err) {
        next(err);
    }
};

const deleteuser = (req, res, next) => {
    deleteUserModel(req.params.user_id, (err, result) => {
        if (err) return next(err);
        if (result?.protectedAdmin) {
            return res.status(403).send({ success: false, message: "SUPER_ADMIN account cannot be deleted", data: null });
        }
        res.send({ success: true, message: "User deleted successfully", data: result });
    });
};

const updateStatus = (req, res, next) => {
    const status = String(req.body.account_status || "").toUpperCase();
    if (!["ACTIVE", "INACTIVE"].includes(status)) return res.status(400).json({ success: false, message: "Status must be ACTIVE or INACTIVE", data: null });
    updateStatusModel(req.params.user_id, status, (err, result) => {
        if (err) return next(err);
        if (result?.protectedAdmin) {
            return res.status(403).send({ success: false, message: "SUPER_ADMIN account status cannot be changed", data: null });
        }
        res.send({ success: true, message: "Status updated successfully", data: result });
    });
};

const getusersById = (req, res, next) => {
    getUserByIdModel(req.params.user_id, (err, result) => {
        if (err) return next(err);
        if (!result.length) return res.status(404).send({ success: false, message: "User not found", data: null });
        res.send({ success: true, message: "User information fetched successfully", data: result[0] });
    });
};

const updateuser = async (req, res, next) => {
    const { full_name, email, role_id, password } = req.body;
    if (!full_name?.trim() || !email?.trim() || !role_id) return res.status(400).json({ success: false, message: "Name, email and role are required", data: null });
    if (password && password.length < 8) return res.status(400).json({ success: false, message: "New password must be at least 8 characters", data: null });
    try {
        const data = { full_name, email, role_id, password: password ? await bcrypt.hash(password, 10) : null };
        updateUserModel(req.params.user_id, data, (err, result) => {
        if (err) return next(err);
        if (!result.affectedRows) return res.status(404).send({ success: false, message: "User not found", data: null });
        res.send({ success: true, message: "User updated successfully", data: result });
        });
    } catch (error) { next(error); }
};

module.exports = { getusers, adduser, deleteuser, updateStatus, getusersById, updateuser };

