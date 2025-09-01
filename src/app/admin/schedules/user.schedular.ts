import nodeCron from "node-cron";
import { cronDeleteUnonboardedAdminAccounts } from "../tasks/schedule.tasks";
const cron = nodeCron;

// Run cleanup every 2AM
cron.schedule("0 0 2 * * *", async () => {
  console.log("Running cleanup job every 2AM");
  await cronDeleteUnonboardedAdminAccounts();
});

// Run cleanup every second
// cron.schedule("* * * * * *", async () => {
//   console.log("Running cleanup job every second");
//   await cronDeleteUnonboardedAdminAccounts();
// });
