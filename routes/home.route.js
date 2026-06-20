import express from "express";
import homePage, { about, project } from "../controllers/home.controller.js";
import { authorize, protects } from "../middlewares/auth.middleware.js";

const homeRouter = express.Router();

// protects,
homeRouter.get("/home", homePage);

homeRouter.get("/about", protects, about);

homeRouter.get("/projects", project);

// POST FOR CLIENT TO CREATE SUGGESTIONS OR HELP
// homeRouter.post('/');

// PUT FOR CLIENT TO UPDATE SUGGESTIONS OR HELP
// homeRouter.put('/');

// DELETE FOR CLIENT TO DELETE THEIR UPDATE SUGGESTIONS OR HELP
// homeRouter.delete('/');

export default homeRouter;
