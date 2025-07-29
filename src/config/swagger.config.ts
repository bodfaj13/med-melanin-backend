import swaggerJsdoc from 'swagger-jsdoc';

const port = process.env.PORT || 3007;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Myomectomy Aftercare API',
      version: '1.0.1',
      description:
        'API for digitizing aftercare brochures for myomectomy patients',
      contact: {
        name: 'API Support',
        email: 'support@myomectomy-aftercare.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
      {
        url: 'https://api.myomectomy-aftercare.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        TestSchema: {
          type: 'object',
          properties: {
            test: {
              type: 'string',
              example: 'This is a test schema',
            },
          },
        },
        BrochureItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the item',
            },
            text: {
              type: 'string',
              description: 'The text content of the item',
            },
            completed: {
              type: 'boolean',
              description: 'Whether the item has been completed',
            },
            notes: {
              type: 'string',
              description: 'Optional notes for the item',
            },
          },
          required: ['id', 'text', 'completed'],
        },
        ContentBlock: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the content block',
            },
            title: {
              type: 'string',
              description: 'Title of the content block',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/BrochureItem',
              },
            },
          },
          required: ['id', 'title', 'items'],
        },
        BrochureSection: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the section',
            },
            title: {
              type: 'string',
              description: 'Title of the section',
            },
            content: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ContentBlock',
              },
            },
          },
          required: ['id', 'title', 'content'],
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
            },
            data: {
              type: 'object',
              description: 'The response data',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
          },
          required: ['success'],
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user',
            },
            firstName: {
              type: 'string',
              description: 'User\'s first name',
            },
            lastName: {
              type: 'string',
              description: 'User\'s last name',
            },
            email: {
              type: 'string',
              description: 'User\'s email address',
            },
            surgeryDate: {
              type: 'string',
              format: 'date',
              description: 'Date of surgery',
            },
            recoveryDay: {
              type: 'number',
              description: 'Current recovery day',
            },
            createdAt: {
              type: 'string',
              format: 'date',
              description: 'User creation date',
            },
          },
          required: ['id', 'firstName', 'lastName', 'email'],
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            docs: {
              type: 'array',
              description: 'Array of items',
            },
            totalDocs: {
              type: 'number',
              description: 'Total number of documents',
            },
            limit: {
              type: 'number',
              description: 'Number of items per page',
            },
            totalPages: {
              type: 'number',
              description: 'Total number of pages',
            },
            page: {
              type: 'number',
              description: 'Current page number',
            },
            pagingCounter: {
              type: 'number',
              description: 'Starting index of current page',
            },
            hasPrevPage: {
              type: 'boolean',
              description: 'Whether there is a previous page',
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Whether there is a next page',
            },
            prevPage: {
              type: 'number',
              description: 'Previous page number',
            },
            nextPage: {
              type: 'number',
              description: 'Next page number',
            },
          },
          required: ['docs', 'totalDocs', 'limit', 'totalPages', 'page'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
              example: false,
            },
            error: {
              type: 'string',
              description: 'General error message',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              description: 'Array of field-specific errors',
              items: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'Error message for the specific field',
                    example: 'Email already in use',
                  },
                  field: {
                    type: 'string',
                    description: 'Field name that has the error',
                    example: 'email',
                  },
                },
                required: ['message', 'field'],
              },
              example: [
                {
                  message: 'Email already in use',
                  field: 'email',
                },
                {
                  message: 'Password is too weak',
                  field: 'password',
                },
              ],
            },
          },
          required: ['success', 'error'],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
  failOnErrors: true,
  verbose: true,
};

export const specs = swaggerJsdoc(options);
export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .models { display: block !important; }
    .swagger-ui .model-box { display: block !important; }
    .swagger-ui .model { display: block !important; }
    .swagger-ui .scheme-container { display: block !important; }
    .swagger-ui .scheme-container .scheme-title { display: block !important; }
    .swagger-ui .scheme-container .scheme-container { display: block !important; }
  `,
  customSiteTitle: 'Myomectomy Aftercare API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 3,
    displayRequestDuration: true,
    tryItOutEnabled: true,
    showExtensions: true,
    showCommonExtensions: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    onComplete: function () {
      console.log('Swagger UI loaded');
    },
  },
};
