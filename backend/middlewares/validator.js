const { body, validationResult } = require('express-validator');
const moment = require('moment'); // Make sure you have moment installed

// Register validation rules
const registerRules = () => {
    return [
        body('username', 'Username is required').notEmpty(),
        body('email', 'Please provide a valid email').isEmail(),
        body('password', 'Password must be between 6 and 20 characters, contain at least one uppercase letter, one number, and one symbol')
            .isLength({ min: 6, max: 20 })
            .matches(/[A-Z]/) // At least one uppercase letter
            .matches(/\d/)    // At least one number
            .matches(/[!@#$%^&*(),.?":{}|<>]/), // At least one symbol
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
        body('confirmEmail')
            .custom((value, { req }) => {
                if (value !== req.body.email) {
                    throw new Error('Emails do not match');
                }
                return true;
            }),
        body('dateofbirth', 'Date of birth must be in the format YYYY-MM-DD')
            .isDate()
            .custom(value => {
                // Calculate the user's age
                const age = moment().diff(moment(value, 'YYYY-MM-DD'), 'years');
                if (age < 10) {
                    throw new Error('You must be at least 10 years old');
                }
                return true;
            }),
            body('phone','phone numaber must be 8 digitals').isLength({min:8}),
            body("sexe","sexe is required").notEmpty()
         
    ];
};

// Login validation rules
const LoginRules = () => {
    return [
        body('email', 'Please provide a valid email').isEmail(),
        body('password', 'Password must be between 6 and 20 characters, contain at least one uppercase letter, one number, and one symbol')
            .isLength({ min: 6, max: 20 })
            .matches(/[A-Z]/) // At least one uppercase letter
            .matches(/\d/)    // At least one number
            .matches(/[!@#$%^&*(),.?":{}|<>]/) // At least one symbol
    ];
};
// get all users


// Validation middleware
const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { registerRules, LoginRules, validator };
