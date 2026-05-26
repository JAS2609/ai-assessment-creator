import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const assessmentQueue = new Queue('assessment', {
  connection: redis,
});