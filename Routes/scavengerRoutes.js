import express from "express";
import * as auth from "../Controller/authController.js";
import {
  getAllScavenger,
  getScavenger,
  updateScavenger,
  createScavenger,
  deleteScavenger,
} from "../Controller/scavengerController.js";
import {
  getClueLocations,
  getClueLocation,
  createClueLocation,
  updateClueLocation,
  deleteClueLocation,
} from '../Controller/clueLocationController.js';

const scavengerRouter = express.Router();
scavengerRouter
  .route("/")
  .get([auth.protect, auth.restrictTo("user", "admin")], getAllScavenger)
  .post([auth.protect, auth.restrictTo("admin")], createScavenger);

scavengerRouter
  .route("/:id")
  .get([auth.protect, auth.restrictTo("user", "admin")], getScavenger)
  .patch([auth.protect, auth.restrictTo("admin")], updateScavenger)
  .delete([auth.protect, auth.restrictTo("admin")], deleteScavenger);

scavengerRouter
  .route('/:id/clueLocations')
  .get([auth.protect, auth.restrictTo('user', 'admin')], getClueLocations)
  .post([auth.protect, auth.restrictTo('admin')], createClueLocation);

scavengerRouter
  .route('/:id/clueLocations/:locationId')
  .get([auth.protect, auth.restrictTo('user', 'admin')], getClueLocation)
  .patch([auth.protect, auth.restrictTo('admin')], updateClueLocation)
  .delete([auth.protect, auth.restrictTo('admin')], deleteClueLocation);

export { scavengerRouter };
