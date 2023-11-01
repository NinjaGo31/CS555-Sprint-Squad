import express from "express";
import * as auth from "../Controller/authController.js";
import {
  getAllScavenger,
  getScavenger,
  updateScavenger,
  createScavenger,
  deleteScavenger,
} from "../Controller/scavengerController.js";
const scavengerRouter = express.Router();
scavengerRouter
  .route("/")
  // .get([auth.protect, auth.restrictTo("user", "admin")], getAllScavenger)
  .get(getAllScavenger)
  .post([auth.protect, auth.restrictTo("admin")], createScavenger);

scavengerRouter
  .route("/:id")
  .get([auth.protect, auth.restrictTo("user", "admin")], getScavenger)
  .patch([auth.protect, auth.restrictTo("admin")], updateScavenger)
  .delete([auth.protect, auth.restrictTo("admin")], deleteScavenger);
export { scavengerRouter };
