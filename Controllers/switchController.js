const SwitchRepository = require('../Repository/switchRepository');
const SwitchDTO = require('../DTO/switchDTO');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const safeHandlebars = allowInsecurePrototypeAccess(handlebars);

class SwitchController {

    async getSwitchView(req, res) {
        try {
            const switchesData = await SwitchRepository.getAll();

            const formattedSwitchesData = switchesData.map((switchNet) => ({
                ...switchNet._doc,
                createdAt: new Date(switchNet.createdAt).toLocaleDateString('pt-BR'),
                updatedAt: new Date(switchNet.updatedAt).toLocaleDateString('pt-BR')
            }));

            const viewFile = fs.readFileSync(path.join(__dirname, '..', 'views', 'switch.handlebars'), 'utf8');

            const template = safeHandlebars.compile(viewFile);
            const htmlContent = template({ switches: formattedSwitchesData });

            res.send(htmlContent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const switchDTO = new SwitchDTO(req.body);
            const newSwitch = await SwitchRepository.create(switchDTO);
            return res.status(201).json(newSwitch);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedSwitch = await SwitchRepository.update(req.params.id, req.body);
            if (!updatedSwitch) return res.status(404).json({ message: 'Item not found' });
            return res.status(200).json(updatedSwitch);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deletedSwitch = await SwitchRepository.delete(req.params.id);
            if (!deletedSwitch) return res.status(404).json({ message: 'Item not found' });
            return res.status(200).json(deletedSwitch); 
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const switchesData = await SwitchRepository.getAll();
            if (!switchesData.length) return res.status(200).json({ message: 'Nenhum Switch Cadastrado!' }); 
            return res.status(200).json(switchesData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const switchData = await SwitchRepository.getById(req.params.id);
            //if (!switchData.length) return res.status(200).json({ message: 'Nenhum Switch Encontrado!' }); 
            return res.status(200).json(switchData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new SwitchController();