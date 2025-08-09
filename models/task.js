// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        fileName: { type: String, required: true }, // Original name of the file
        fileUrl: { type: String, required: true }, // Cloudinary secure URL
        publicId: { type: String, required: true }, // Cloudinary's unique file ID (needed if you ever want to delete from Cloudinary)
        resourceType: { type: String, default: "raw" }, // Could be 'raw', 'image', 'video' in Cloudinary
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
