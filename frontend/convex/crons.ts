import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// crons.interval(
//   "Grab Health Data from Terra API Everyday and store in the database for analysis",
//   { hours: 24 } // every hour
//   //   internal.messages.clearAll
// );

// An alternative way to create the same schedule as above with cron syntax
export default crons;
