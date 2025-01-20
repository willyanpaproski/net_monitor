const TransmissorRepository = require('../Repository/transmissorRepository');
const TransmissorDTO = require('../DTO/transmissorDTO');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const safeHandlebars = allowInsecurePrototypeAccess(handlebars);

class TransmissorController {

    async getTransmissorView(req, res) {
        try {
            const transmissorsData = await TransmissorRepository.getAll();

            const formattedTransmissorsData = transmissorsData.map((transmissor) => ({
                ...transmissor._doc,
                createdAt: new Date(transmissor.createdAt).toLocaleDateString('pt-BR'),
                updatedAt: new Date(transmissor.updatedAt).toLocaleDateString('pt-BR')
            }));

            const viewFile = fs.readFileSync(path.join(__dirname, '..', 'views', 'transmissor.handlebars'), 'utf8');

            const template = safeHandlebars.compile(viewFile);
            const htmlContent = template({ transmissors: formattedTransmissorsData });

            res.send(htmlContent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const transmissorDTO = new TransmissorDTO(req.body);
            const newTransmissor = await TransmissorRepository.create(transmissorDTO);
            return res.status(201).json(newTransmissor);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedTransmissor = await TransmissorRepository.update(req.params.id, req.body);
            if (!updatedTransmissor) return res.status(404).json({ message: 'Item not found' });
            return res.status(200).json(updatedTransmissor);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deletedTransmissor = await TransmissorRepository.delete(req.params.id);
            if (!deletedTransmissor) return res.status(404).json({ message: 'Item not found' });
            return res.status(200).json(deletedTransmissor);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const transmissorsData = await TransmissorRepository.getAll();
            if (!transmissorsData.length) return res.status(200).json({ message: 'Nenhum Transmissor (OLT) Cadastrado!' });
            return res.status(200).json(transmissorsData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const transmissorData = await TransmissorRepository.getById(req.params.id);
            //if (!transmissorData.length) return res.status(200).json({ message: 'Nenhum Transmissor (OLT) Encontrado!' });
            return res.status(200).json(transmissorData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new TransmissorController();