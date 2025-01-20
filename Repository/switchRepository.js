const Switch = require('../models/switch');

class SwitchRepository {
    
    async create(switchData) {
        const switchNet = new Switch(switchData);
        return await switchNet.save();
    }

    async update(Id, switchData) {
        return await Switch.findByIdAndUpdate(Id, switchData, { new: true });
    }

    async delete(Id) {
        return await Switch.findByIdAndDelete(Id);
    }

    async getAll() {
        return await Switch.find();
    }

    async getById(Id) {
        return await Switch.findById(Id);
    }

}

module.exports = new SwitchRepository();