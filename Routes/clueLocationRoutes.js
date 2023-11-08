import express from 'express';
import * as auth from '../Controller/authController.js';
import {
  getAllClueLocations,
  getClueLocation,
  createClueLocation,
  updateClueLocation,
  deleteClueLocation
} from '../Controller/clueLocationController.js';

const clueLocationRouter = express.Router();

clueLocationRouter.route('/')
  .get([auth.protect, auth.restrictTo('user', 'admin')], getAllClueLocations)
  .post([auth.protect, auth.restrictTo('admin')], createClueLocation);

clueLocationRouter.route('/:id')
  .get([auth.protect, auth.restrictTo('user', 'admin')], getClueLocation)
  .patch([auth.protect, auth.restrictTo('admin')], updateClueLocation)
  .delete([auth.protect, auth.restrictTo('admin')], deleteClueLocation);

export { clueLocationRouter };