import { User as userModel } from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisify } from "util";
import {sendEmail} from "../Utils/email.js";
import crypto from "crypto";
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

async function forgotPassword(req, res, next){
  //1.get user based on posted email
  const user = await userModel.findOne({email:req.body.email})
  if(!user){
    const err = new Error(`Error: We could not find the user with the given mail`);
      err.statusCode = 404;
      return next(err);

  }
  //2.generate a random token
  const resetToken = user.createResetPasswordToken();
  await user.save({validateBeforeSave:false});
  //3.send the token back to the user email
  //const resetUrl =`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const resetUrl = `${req.protocol}://${req.get('host').includes('3000') ? 'localhost:5173' : req.get('host')}/resetPassword/${resetToken}`;
  const message = `We have received a password reset request.Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 mins`;
  //handling for rejected promise
  try{
    await sendEmail({
      email:user.email,
      subject:'Password change request received',
      message :message
    });
    res.status(200).json({
      status:'success',
      message:'Password reset link sent to the user email!! '
    })

  }catch(e){
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.save({validateBeforeSave:false});
    return next(new Error(`Error: There was an error sending password reset mail. Please try again later`,500));
  }


}

async function resetPassword(req, res, next){
//If the users exists and the given password reset token has not expired
  const token =crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await userModel.findOne({passwordResetToken:token,passwordResetTokenExpire:{$gt:Date.now()}})
  if(!user){
    const err = new Error(`Error: Token is invalid or expired`);
      err.statusCode = 400;
      return next(err);
  }
  //Resetting the user password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  user.passwordChangedAt = Date.now();
  user.save();
  //login the user
  const logintoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(201).json({
    status: "success",
    logintoken,
  });
}
export { signUp, logIn, protect, restrictTo, forgotPassword, resetPassword};
