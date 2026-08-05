import express from "express";
import homePage, {
  about,
  privacyPolicy,
  project,
  settings,
  termsOfUse,
} from "../controllers/home.controller.js";
import { authorize, protects } from "../middlewares/protect.middleware.js";
import { user } from "../controllers/authLogin.controller.js";

const homeRouter = express.Router();

// protects,
homeRouter.get("/home", homePage);

// protects
homeRouter.get("/about", about);

homeRouter.get("/settings", settings);

homeRouter.get("/projects", project);

homeRouter.get("/projects", project);

homeRouter.get("/projects", project);
// authenticate
homeRouter.get("/user", user);

homeRouter.get("/privacy-policy", privacyPolicy);

homeRouter.get("/terms-of-use", termsOfUse);

export default homeRouter;
