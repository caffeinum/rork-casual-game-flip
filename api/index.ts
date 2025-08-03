import path from 'path';
import { createRequestHandler } from '@expo/server/adapter/vercel';

const SERVER_BUILD_DIR = path.join(process.cwd(), 'dist/server');

export default createRequestHandler({
  build: SERVER_BUILD_DIR,
});