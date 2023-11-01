import { User as userModel } from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisify } from "util";
async function signUp(req, res, next) {
  try {
    const { userName, email, password, passwordConfirm, role } = req.body;

    const user = await userModel.create({
      userName,
      email,
      password,
      passwordConfirm,
      role,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: "fail",
      data: {
        error,
      },
    });
  }
}
async function logIn(req, res, next) {
  try {
    const { userName, password: passwordProvided } = req.body;
    if (userName === undefined && passwordProvided === undefined) {
      // todo throw error if no password or username is given
      const err = new Error(`Error: no password or username is given`);
      err.statusCode = 401;
      return next(err);
    }
    const user = await userModel
      .findOne({ userName: userName })
      .select("+password");
    if (!user) {
      // to do throw error
      const err = new Error(`Error: no user found`);
      err.statusCode = 404;
      return next(err);
    }
    const correctPass = await bcrypt.compare(passwordProvided, user.password);
    if (!correctPass) {
      // to do throw error
      const err = new Error(`Error: password or username is incorrect.`);
      err.statusCode = 401;
      return next(err);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);
  }
}
async function protect(req, res, next) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      // throw error
      const err = new Error(`Error: no password or username is given`);
      err.statusCode = 401;
      return next(err);
    }
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id);
    if (!user) {
      // throw error
      const err = new Error(`Error: no password or username is given`);
      err.statusCode = 401;
      return next(err);
    }
    if (user.changedPasswordAfter(decode.iat)) {
      // throw an error
      const err = new Error(`Error: no password or username is given`);
      err.statusCode = 401;
      return next(err);
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
}
function restrictTo(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      // throw an error
      const err = new Error(
        `Error: user does not have access rights to the content`
      );
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
}
export { signUp, logIn, protect, restrictTo };
