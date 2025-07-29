import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './config/database.config';
import { specs, swaggerUiOptions } from './config/swagger.config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import brochureRoutes from './routes/brochure.routes';
import symptomEntryRoutes from './routes/symptom-entry.routes';

const startServer = async () => {
  try {
    await connectDatabase();

    const app = express();
    const PORT = process.env.PORT || 3007;

    // Middleware
    app.use(helmet());
    app.use(morgan('combined')); // HTTP request logger
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
      })
    );
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Swagger documentation
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, swaggerUiOptions)
    );

    // API Routes
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/brochures', brochureRoutes);
    app.use('/api/v1/tracker', symptomEntryRoutes);

    app.listen(PORT, () => {
      console.log('🚀 Server running on port', PORT);
      console.log('📊 Health check: http://localhost:' + PORT + '/health');
      console.log('🔗 API Base: http://localhost:' + PORT + '/api/v1');
      console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
