const Joi = require("joi");

const registerSchema = Joi.object({
    customer_name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().max(254).required(),
    mobile_number: Joi.string().trim().pattern(/^[0-9+() -]{7,20}$/).required(),
    password: Joi.string().min(8).max(72).required()
});

const loginSchema = Joi.object({ email: Joi.string().trim().email().required(), password: Joi.string().min(1).max(72).required() });

function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: true, stripUnknown: true });
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        req.body = value;
        next();
    };
}

module.exports = { validateRegister: validate(registerSchema), validateLogin: validate(loginSchema) };
