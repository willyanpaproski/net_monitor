//Importação de Pacotes
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const Handlebars = require('handlebars');
const fs = require('fs');

//Importação de Rotas
const routerRoutes = require('./routes/routerRoutes');
const transmissorRoutes = require('./routes/transmissorRoutes');
const switchRoutes = require('./routes/switchRoutes');
const pppActiveConnectionsDuringDayRoutes = require('./routes/pppActiveConnectionsDuringDayRoutes');

app.use(cors({
    origin: '*', // Permitir todas as origens (use uma URL específica no lugar de '*' em produção)
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
    credentials: true, 
}));

//Middleware Para Trabalhar com Retornos JSON
app.use(express.json());

//Configuração do Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    extname: '.handlebars',
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
app.use('/', pppActiveConnectionsDuringDayRoutes);

module.exports = {
    app: app,
    mongoose: mongoose,
};