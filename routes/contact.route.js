import express from "express";
import {
  handleContactForm,
  handleContactLogic,
} from "../controllers/contact.controller.js";
import { contactSuccess } from "../controllers/home.controller.js";

const contactRouter = express.Router();

// authorize,
contactRouter.get("/contact", handleContactForm);

contactRouter.get("/contact-success", contactSuccess);

contactRouter.post("/contact", handleContactLogic);


export default contactRouter;
