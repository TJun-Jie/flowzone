import { httpRouter } from "convex/server";
import { getTerraAPI, grabHealthDataForCronJobDaily } from "./stressScores";

const http = httpRouter();

http.route({
  path: "/getHealthData",
  method: "POST",
  handler: getTerraAPI,
});

http.route({
  path: "/getCronJobDataDaily",
  method: "GET",
  handler: grabHealthDataForCronJobDaily,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
