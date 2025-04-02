const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(6)
            .max(100)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))  // * At least one uppercase, one lowercase, and one number
            .message("Password must contain at least one uppercase letter, one lowercase letter, and one number")
            .required(),
        phone: Joi.string()
            .pattern(/^[6-9]\d{9}$/)  // * Validates Indian phone numbers (10 digits, starts with 6-9)
            .message("Phone number must be a valid 10-digit Indian number")
            .required(),
        role: Joi.string().valid("user", "admin").default("user"),  // * Ensures only "user" or "admin"
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

module.exports = { signupValidation, loginValidation };
