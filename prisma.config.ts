// prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Explicitly load the .env file
dotenv.config();

export default defineConfig({
  datasource: {
    // Adding a fallback check to help with debugging
    url: process.env.DATABASE_URL,
  },
});