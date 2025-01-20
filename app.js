//Importação de Pacotes
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const path = require('path');
const cors = require('cors');

//Importação de Rotas
const routerRoutes = require('./routes/routerRoutes');
const transmissorRoutes = require('./routes/transmissorRoutes');
const switchRoutes = require('./routes/switchRoutes');

app.use(cors());

//Middleware Para Trabalhar com Retornos JSON
app.use(express.json());

//Configuração do Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main', // Define o layout padrão
    extname: '.handlebars', // Extensão dos arquivos (opcional, padrão é .handlebars)
    partialsDir: path.join(__dirname, 'public/partials')  // Diretório das partials
}));

// Setar a engine para o Express
app.set('view engine', 'handlebars');

// Definir o diretório onde os templates estarão
app.set('views', './views');

//Define o Diretório Public
app.use(express.static(path.join(__dirname, 'public')));

//Rota Principal
app.get('/', (req, res) => {
    res.render('index');
});

//Demais Rotas
app.use('/', routerRoutes);
app.use('/', transmissorRoutes);
app.use('/', switchRoutes);

module.exports = {
    app: app,
    mongoose: mongoose,
};