const mongoose = require('../app').mongoose;
require('dotenv').config();
const mongoDbUrl = process.env.MONGODB_URL;

const mongoDbConnection = async () => {
    try {
        await mongoose.connect(mongoDbUrl);
        console.log('Conexão com o banco de dados realizada com sucesso!');
    } catch (error) {
        console.log(`Erro ao realizar conexão com o banco de dados: ${error}`);
    }
}

module.exports = mongoDbConnection;