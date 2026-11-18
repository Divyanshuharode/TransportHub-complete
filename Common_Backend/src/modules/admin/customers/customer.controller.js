const {
    getCustomersModel,
    totalCustomersModel,
    activeCustomersModel,
    inActiveCustomersModel,
    addCustomerModel,
    updateCustomerModel,
    deleteCustomerModel
} = require("./customer.model");

const getCustomers = (req, res, next) => {
    getCustomersModel((err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Customers fetched successfully", data: result });
    });
};

const totalCustomers = (req, res, next) => {
    totalCustomersModel((err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Total customers fetched successfully", data: result });
    });
};

const activeCustomers = (req, res, next) => {
    activeCustomersModel((err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Active customers fetched successfully", data: result });
    });
};

const inActiveCustomers = (req, res, next) => {
    inActiveCustomersModel((err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Inactive customers fetched successfully", data: result });
    });
};

const addCustomers = (req, res, next) => {
    const data = { customer_name: req.body.customer_name, email: req.body.email, mobile_number: req.body.mobile_number };

    addCustomerModel(data, (err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Customer added successfully", data: result });
    });
};

const updateCustomer = (req, res, next) => {
    const customer_id = req.params.customer_id;
    const { customer_name, mobile_number, city, address } = req.body;
    if (!customer_name?.trim() || !mobile_number?.trim()) return res.status(400).json({ success: false, message: "Name and mobile number are required" });
    updateCustomerModel(customer_id, { customer_name: customer_name.trim(), mobile_number: mobile_number.trim(), city, address }, (err, result) => {
        if (err) { return next(err) }
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Customer not found" });
        res.send({ success: true, message: "Customer updated successfully", data: result })
    })
}

const deleteCustomer = (req, res, next) => {
    const customer_id = req.params.customer_id;
    deleteCustomerModel(customer_id, (err, result) => {
        if (err) return next(err)
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Customer not found" });
        res.send({ success: true, message: "customer deleted succsessfully", data: result })
    });
}

module.exports = { getCustomers, totalCustomers, activeCustomers, inActiveCustomers, addCustomers, updateCustomer, deleteCustomer };
