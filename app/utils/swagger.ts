import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Docs",
      version: "1.0.0",
      description: "Express API with Swagger",
    },
    servers: [
      {
        url: "http://localhost:8081/api/v1", // langsung pointing ke versi API kamu
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"], // ambil semua route file TS
};

const swaggerSpec = swaggerJsDoc(options);

export function swaggerDocs(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
