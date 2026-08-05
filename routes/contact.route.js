import express from "express";
import {
  handleContactForm,
  handleContactLogic,
} from "../controllers/contact.controller.js";

const contactRouter = express.Router();

// authorize,
contactRouter.get("/contact", handleContactForm);

contactRouter.post("/contact", handleContactLogic);

export default contactRouter;
