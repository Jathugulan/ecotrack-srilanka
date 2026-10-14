import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import wasteReportRoutes from './modules/waste-reports/wasteReport.routes.js';
import scheduleRoutes from './modules/schedules/schedule.routes.js';
import collectionTaskRoutes from './modules/collection-tasks/collectionTask.routes.js';
import vehicleRoutes from './modules/vehicles/vehicle.routes.js';
import serviceZoneRoutes from './modules/service-zones/serviceZone.routes.js';
import organizationRoutes from './modules/organizations/organization.routes.js';
import recyclingCenterRoutes from './modules/recycling-centers/recyclingCenter.routes.js';
import recyclingTransactionRoutes from './modules/recycling-transactions/recyclingTransaction.routes.js';
import rewardRoutes from './modules/rewards/rewards.routes.js';
import aiRoutes from './modules/ai-classification/aiClassification.routes.js';
import routeRoutes from './modules/routes/routes.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import auditLogRoutes from './modules/audit-logs/auditLog.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or dev tools)
      if (!origin) return callback(null, true);
      return callback(null, true); // Dev flexible origin
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static uploads serving
const uploadsPath = path.resolve(process.cwd(), env.UPLOAD_DIR);
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'EcoTrack Sri Lanka API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// REST API v1 routes
const apiPrefix = env.API_PREFIX;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/reports`, wasteReportRoutes);
app.use(`${apiPrefix}/schedules`, scheduleRoutes);
app.use(`${apiPrefix}/collection-tasks`, collectionTaskRoutes);
app.use(`${apiPrefix}/vehicles`, vehicleRoutes);
app.use(`${apiPrefix}/service-zones`, serviceZoneRoutes);
app.use(`${apiPrefix}/organizations`, organizationRoutes);
app.use(`${apiPrefix}/recycling-centers`, recyclingCenterRoutes);
app.use(`${apiPrefix}/recycling-transactions`, recyclingTransactionRoutes);
app.use(`${apiPrefix}/rewards`, rewardRoutes);
app.use(`${apiPrefix}/ai`, aiRoutes);
app.use(`${apiPrefix}/routes`, routeRoutes);
app.use(`${apiPrefix}/notifications`, notificationRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/audit-logs`, auditLogRoutes);
app.use(`${apiPrefix}/upload`, uploadRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
