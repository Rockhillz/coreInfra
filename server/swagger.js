const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",  // OpenAPI version
        info: {
            title: "Payment Card API", // API title
            version: "1.0.0", // API version
            description: "API documentation for the Payment Card System", // Short description
        },
        servers: [
            {
                url: "http://localhost:7000",
                description: "Development Server"
            }
        ],
    },
    apis: ["./routes/*.js"],
};

// Generate API Docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);


module.exports = { swaggerUi, swaggerDocs };
