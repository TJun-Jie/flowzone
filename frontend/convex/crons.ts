import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Grab Health Data from Terra API Everyday and store in the database for analysis",
  { hours: 24 },
  internal.sleepScores.getSleepScoreForCronJob,
  {
    hour: 0,
  }
);

crons.interval(
  "Create an empty slate for daily metrics",
  { hours: 24 },
  internal.dailyMetrics.createDailyMetricsBlankForCronJob,
  {
    date: new Date().toISOString(),
    ratingOfDay: 0,
    wins: [],
    losses: [],
    weight: 0,
    actionItemsCompleted: [],
    sleepHours: 0,
  }
);

// An alternative way to create the same schedule as above with cron syntax
export default crons;
