import { getTopStories } from '../controllers/ingestController.js';
import { CronJob } from 'cron';

export const job = new CronJob(
  '*/30 * * * *',
  function () {
    getTopStories();
  },
);
