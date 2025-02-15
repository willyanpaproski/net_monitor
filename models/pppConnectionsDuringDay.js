const mongoose = require('mongoose')

const pppConnectionsDuringDaySchema = new mongoose.Schema({
    nasId: {
        type: String,
        required: true
    },
    monitoringTime: {
        type: Date,
        required: true
    },
    numberOfConnections: {
        type: BigInt,
        required: true
    }
});

const PppConnectionsDuringDay = mongoose.model('PppConnectionsDuringDay', pppConnectionsDuringDaySchema);
module.exports = PppConnectionsDuringDay;