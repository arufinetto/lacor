/*const Queue = require("bull");

const smsNotificationQueue = new Queue("Fetch Data", process.env.REDIS_URL);

const URLS = [
  // list of urls to scrape...
];

URLS.forEach((url) =>
  smsNotificationQueue.add({ url }, { repeat: { cron: "0 0 * * *" } })
);
*/

const Queue = require('bull');
//const sendMail = require('../utils/sendMail');
/** Initializing the Queue */
const smsNotificationQueue = new Queue('smsNotification', {
   redis: {
      host: process.env.LOCAL_HOST,  // 127.0.0.1
      port: process.env.REDIS_PORT,  // 6379
   },
});
