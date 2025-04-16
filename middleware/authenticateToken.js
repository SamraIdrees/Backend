import jwt from "jsonwebtoken";
import Joi from "joi";

// Token authentication middleware
// export const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// };

// Token authentication middleware
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Extract token from Bearer token

    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token is not valid or has expired" });
        }
        req.user = user;
        next();
    });
};


// Sign-up validation based on userSchema
export const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string().min(4).max(100).required(), // fullName validation
        // phone: Joi.string().length(11).pattern(/^[0-9]+$/).required(), // phone validation (length and numeric)
        email: Joi.string().email().required(), // email validation
        password: Joi.string().min(8).max(20).required(), // password validation
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }

    next();
};

// Login validation (email and password)
export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(), // email validation
        password: Joi.string().min(3).max(100).required(), // password validation
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }

    next();
};