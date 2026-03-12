import app from './app.js';
import { prisma } from './lib/prisma.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Test Database Connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // 2. Start Listening
    app.listen(PORT, () => {
      console.log(`🚀 Vaniga Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();