const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = process.env.SALT_ROUNDS;

const SwitchSchema = new mongoose.Schema({
    integration: {
        type: 'String',
        enum: ['Cisco Catalyst', 'Huawei Ce6000'],
        default: 'Cisco Catalyst',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 25
    },
    description: {
        type: String,
        required: false,
        trim: false,
        minlength: 1,
        maxlength: 120
    },
    accessUsername: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 25
    },
    accessPassword: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    accessIP: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 15
    },
    snmpCommunity: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 15
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

SwitchSchema.pre('save', async function (next) {
    if (!this.isModified('accessPassword')) {
        return next();
    }

    try {
        const bcryptSalt = await bcrypt.genSalt(parseInt(saltRounds));
        this.accessPassword = await bcrypt.hash(this.accessPassword, bcryptSalt);
        next();
    } catch (error) {
        next(error);
    }
});

SwitchSchema.methods.comparePassword = async (accessPassword) => {
    return await bcrypt.compare(accessPassword, this.accessPassword);
}

const Switch = mongoose.model('Switch', SwitchSchema);
module.exports = Switch;