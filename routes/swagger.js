const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Visual Tracker Application Platform Backend API',
      version: '3.0.0',
      description: 'VTRAPP API',
    },
  },
  apis: ['routes/backendServices.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;
