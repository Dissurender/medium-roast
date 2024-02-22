import { getTopStories } from '../controllers/ingestController.js';
import { CronJob } from 'cron';

export const job = new CronJob(
  // run every 30 minutes
  '*/30 * * * *',
  function () {
    getTopStories();
  }
);

export const startCron = () => {
  job.start();
};
