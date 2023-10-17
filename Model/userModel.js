import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: [true, "A user must have a username"],
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "A user must have an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password"],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: "Passwords dont match",
    },
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  rewardsCollected: String,
  scavengerHuntsCompleted: String,
  rewardsRedeemed: String,
  passwordChangedAt: Date,
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
const User = mongoose.model("Users", userSchema);
export { User };
