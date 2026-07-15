import cleanupExpiredUsers from "../jobs/cleanupExpiredUsers.job.js";
import cron from "node-cron";

// Schedule the task to run every day at midnight ('0 0 ***')

cron.schedule("0 0 ***", () => {
  console.log("Running daily cron job: cleanupExpiredUsers");
  cleanupExpiredUsers();
});

// cleanupExpiredUsers();
