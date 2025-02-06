const Router = require('../models/roteador');

class RouterRepository {

    async create(routerData) {
        const router = new Router(routerData);
        return await router.save();
    }

    async update(Id, routerData) {
        return await Router.findByIdAndUpdate(Id, routerData, { new: true });
    } 

    async delete(Id) {
        return await Router.findByIdAndDelete(Id);
    }

    async getAll() {
        return await Router.find();
    }

    async getById(Id) {
        return await Router.findById(Id);
    }

    async getMikrotikRouters() {
        return await Router.find({ integration: 'Mikrotik' });
    }

    async getJuniperRouters() {
        return await Router.find({ integration: 'Juniper' });
    }
}

module.exports = new RouterRepository();