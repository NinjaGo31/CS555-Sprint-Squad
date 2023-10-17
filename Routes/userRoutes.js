import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../Controller/userController.js";
import * as auth from "../Controller/authController.js";
const userRouter = express.Router();
userRouter.route("/signup").post(auth.signUp);
userRouter.route("/login").post(auth.logIn);
userRouter
  .route("/")
  .get([auth.protect, auth.restrictTo("admin")], getAllUsers);
userRouter
  .route("/:id")
  .get([auth.protect, auth.restrictTo("admin")], getUser)
  .patch([auth.protect, auth.restrictTo("admin")], updateUser)
  .delete([auth.protect, auth.restrictTo("admin")], deleteUser);
export { userRouter };
