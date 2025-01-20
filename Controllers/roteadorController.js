const RouterRepository = require('../Repository/roteadorRepository');
const RouterDTO = require('../DTO/roteadorDTO');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const safeHandlebars = allowInsecurePrototypeAccess(handlebars);

class RouterController {

    async getRouterView(req, res) {
        try {
            const routersData = await RouterRepository.getAll();
            const formattedRoutersData = routersData.map((router) => ({
                ...router._doc,
                createdAt: new Date(router.createdAt).toLocaleDateString('pt-BR'),
                updatedAt: new Date(router.updatedAt).toLocaleDateString('pt-BR')
            }));
    
            // Lê o arquivo da view handlebars
            const viewFile = fs.readFileSync(path.join(__dirname, '..', 'views', 'router.handlebars'), 'utf8');
    
            // Compila o template com os dados dos roteadores
            const template = safeHandlebars.compile(viewFile);
            const htmlContent = template({ routers: formattedRoutersData });
    
            // Envia o conteúdo renderizado da view
            res.send(htmlContent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const routerDTO = new RouterDTO(req.body);
            const newRouter = await RouterRepository.create(routerDTO);
            res.status(201).json(newRouter);
        } catch (error) {
            console.error('Erro ao criar roteador: ', error);
            res.status(500).json({ error: 'Erro ao criar roteador' });
        }
    }

    async update(req, res) {
        try {
            const updatedRouter = await RouterRepository.update(req.params.id, req.body);
            if (!updatedRouter) return res.status(404).json({ message: 'Item Not Found' });
            return res.status(200).json(updatedRouter);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deletedRouter = await RouterRepository.delete(req.params.id);
            if (!deletedRouter) return res.status(404).json({ message: 'Item Not Found' });
            return res.status(200).json(deletedRouter);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const routersData = await RouterRepository.getAll();
            if (!routersData.length) return res.status(200).json({ message: 'Nenhum Roteador (NAS) Cadastrado!'} );
            res.json({ routers: routersData });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const routerData = await RouterRepository.getById(req.params.id);
            //if (!routerData.length) return res.status(200).json({ message: 'Nenhum Roteador (NAS) Encontrado!' });
            return res.status(200).json(routerData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new RouterController();