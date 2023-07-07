import { Schema, model } from "mongoose";

const refreshtokenSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  refresh_token: {
    type: String,
    require: true,
  },
  expires_at: {
    type: Date,
    required: true,
    default: new Date(new Date().getTime() + 1 * 60 * 1000), // convert from minutes to milli seconds
  },
});

export default model("RefreshToken", refreshtokenSchema);
