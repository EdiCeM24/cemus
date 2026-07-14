import express from "express";
import homePage, {
  about,
  privacyPolicy,
  project,
  termsOfUse,
} from "../controllers/home.controller.js";
import { authorize, protects } from "../middlewares/auth.middleware.js";

const homeRouter = express.Router();

// protects,
homeRouter.get("/home", homePage);

// protects
homeRouter.get("/about", about);

homeRouter.get("/projects", project);

homeRouter.get("/projects", project);

homeRouter.get("/projects", project);

homeRouter.get("/privacy-policy", privacyPolicy);

homeRouter.get("/terms-of-use", termsOfUse);

export default homeRouter;
