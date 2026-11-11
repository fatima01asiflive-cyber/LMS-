import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "please enter your email"],
    validate: {
      validator: function (value: string) {
        return emailRegexPattern.test(value);
      },
      message: "Please enter a valid email address",
    },
    unique: true,
  },
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      courseId: String,
    },
  ],
},{timestamps: true});

//Hash Password before saving user


userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel:Model<IUser> = mongoose.model("User",userSchema);
export default userModel;
