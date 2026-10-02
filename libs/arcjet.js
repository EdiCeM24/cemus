import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
// import { isSpoofedBot } from "@arcjet/inspect";
import { ARCJET_SDK_KEY } from "../config/env.js";

const aj = arcjet({
  key: ARCJET_SDK_KEY,
  // // proxies: ["http://localhost:6002"],
  // whitelist: ["http://localhost", "http://localhost:6002"],
  // characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;
