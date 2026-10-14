import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function startServer() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌿 EcoTrack Sri Lanka REST API Server`);
    console.log(`🚀 Port: ${env.PORT}`);
    console.log(`📡 Base URL: http://localhost:${env.PORT}${env.API_PREFIX}`);
    console.log(`🏥 Health Check: http://localhost:${env.PORT}/health`);
    console.log(`🌏 Timezone: ${env.TIMEZONE}`);
    console.log(`=======================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot failure:', err);
  process.exit(1);
});
