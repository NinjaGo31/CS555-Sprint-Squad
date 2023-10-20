import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: [true, "A User Must Have A Username"],
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "A User Must Have An Email ID"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide A Password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Provide Above Password Again"],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: "Above Passwords Dont Match",
    },
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  rewardsCollected: Object,
  scavengerHuntsCompleted: String,
  rewardsRedeemed: Object,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpire: Date
});

// encrypt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const chnageTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < chnageTimeStamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encryption
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpire = Date.now()+ 10*60*1000;//10 min
  //console.log(resetToken,this.passwordResetToken);
  
  return resetToken;

}
const User = mongoose.model("Users", userSchema);
export { User };
