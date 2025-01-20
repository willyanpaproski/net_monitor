const Transmissor = require('../models/transmissor');

class TransmissorRepository {

    async create(transmissorData) {
        const transmissor = new Transmissor(transmissorData);
        return await transmissor.save();
    }

    async update(Id, transmissorData) {
        return await Transmissor.findByIdAndUpdate(Id, transmissorData, { new: true });
    }

    async delete(Id) {
        return await Transmissor.findByIdAndDelete(Id);
    }

    async getAll() {
        return await Transmissor.find();
    }

    async getById(Id) {
        return await Transmissor.findById(Id);
    }

}

module.exports = new TransmissorRepository();