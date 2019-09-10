let mongoose = require ('mongoose');

let developSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
    },
    address:{
        state: {
            type: String,
        },
        suburb: {
            type: String,
        },
        street: {
            type: String,
        },
        unit: {
            type: Number,
        }
    },
    created: {
        type: Date,
        deafult: Date.now
    }
});

module.exports = mongoose.model('Developers', developSchema)