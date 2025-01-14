const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configurações do Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentação da API do Projeto',
            version: '1.0.0',
            description: 'Documentação da API para os módulos de Produto e Carrinho'
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor Local'
            }
        ]
    },
    apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwaggerDocs;
