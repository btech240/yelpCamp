const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHtml': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHtml: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHtml', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

// Create Joi schema to validate campground inputs
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHtml(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHtml(),
        description: Joi.string().required().escapeHtml()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1),
        body: Joi.string().required().escapeHtml()
    }).required()
});