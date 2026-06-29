import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    company: String,
    status: {
      type: String,
      default: "active",
    },
    lastContactDate: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;