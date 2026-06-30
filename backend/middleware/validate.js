const Joi = require('joi');

// Reusable validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map((d) => d.message);
            res.status(400);
            throw new Error(messages.join(', '));
        }
        next();
    };
};

// ── Auth Schemas ──
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
    }),
    phone: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .min(8)
        .max(20)
        .required()
        .messages({
            'string.pattern.base': 'Phone number is invalid',
            'any.required': 'Phone number is required',
        }),
    role: Joi.string().valid('user', 'admin').default('user'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

// ── Room Schemas ──
const createRoomSchema = Joi.object({
    roomNumber: Joi.string().required().messages({
        'any.required': 'Room number is required',
    }),
    type: Joi.string().valid('Single', 'Double', 'Suite').required().messages({
        'any.only': 'Room type must be Single, Double, or Suite',
        'any.required': 'Room type is required',
    }),
    price: Joi.number().positive().required().messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required',
    }),
    description: Joi.string().min(5).required().messages({
        'any.required': 'Description is required',
    }),
    hotel: Joi.string().required().messages({
        'any.required': 'Hotel ID is required',
    }),
    image: Joi.string(),
});

const updateRoomSchema = Joi.object({
    roomNumber: Joi.string(),
    type: Joi.string().valid('Single', 'Double', 'Suite'),
    price: Joi.number().positive(),
    description: Joi.string().min(5),
    hotel: Joi.string(),
    isAvailable: Joi.boolean(),
    image: Joi.string(),
}).min(1);

// ── Booking Schemas ──
const createBookingSchema = Joi.object({
    room: Joi.string().required().messages({
        'any.required': 'Room ID is required',
    }),
    checkInDate: Joi.date().iso().required().messages({
        'date.format': 'Check-in date must be a valid ISO date',
        'any.required': 'Check-in date is required',
    }),
    checkOutDate: Joi.date().iso().greater(Joi.ref('checkInDate')).required().messages({
        'date.greater': 'Check-out date must be after check-in date',
        'any.required': 'Check-out date is required',
    }),
    totalPrice: Joi.number().positive().required().messages({
        'any.required': 'Total price is required',
    }),
});

// ── Hotel Schemas ──
const createHotelSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'any.required': 'Hotel name is required',
    }),
    location: Joi.string().required().messages({
        'any.required': 'Hotel location is required',
    }),
    description: Joi.string().min(5).required().messages({
        'any.required': 'Hotel description is required',
    }),
    image: Joi.string(),
});

const updateHotelSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    location: Joi.string(),
    description: Joi.string().min(5),
    image: Joi.string(),
}).min(1);

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    createRoomSchema,
    updateRoomSchema,
    createBookingSchema,
    createHotelSchema,
    updateHotelSchema,
};
