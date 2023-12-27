import __dirname from '../utils.js';
export const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "API Docs",
            description: "E-Commerce API Documentation &copy; Nits-Ar",
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}