import { getTopStories } from '../controllers/ingestController.js';
import { CronJob } from 'cron';
const job = new CronJob(
  '*/30 * * * *',
  getTopStories(),
  null,
  true,
  'America/Chicago'
);
