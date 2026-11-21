
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "./config/database.js";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Issue from "./models/Issue.js";

const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Create or find a test user.
    const email = "devtrack.demo@example.com";

    let user = await User.findOne({ email });

    if (!user) {
      if (!process.env.SEED_USER_PASSWORD) {
        throw new Error("SEED_USER_PASSWORD is missing in .env");
      }

      user = new User({
        name: "DevTrack Demo User",
        email,
        password: process.env.SEED_USER_PASSWORD,
        role: "admin",
      });

      await user.save();
      console.log("Test user created:", user._id);
    } else {
      console.log("Test user already exists:", user._id);
    }

    // 2. Create or find a project.
    let project = await Project.findOne({
      name: "DevTrack API",
      owner: user._id,
    });

    if (!project) {
      project = new Project({
        name: "DevTrack API",
        description:
          "A backend project and issue tracking system built with Node.js and MongoDB.",
        owner: user._id,
        status: "active",
      });

      await project.save();
      console.log("Project created:", project._id);
    } else {
      console.log("Project already exists:", project._id);
    }

    // 3. Create or find an issue.
    let issue = await Issue.findOne({
      title: "Implement user authentication",
      project: project._id,
    });

    if (!issue) {
      issue = new Issue({
        title: "Implement user authentication",
        description:
          "Build secure user registration and login functionality.",
        project: project._id,
        createdBy: user._id,
        assignee: user._id,
        type: "feature",
        status: "open",
        priority: "high",
      });

      await issue.save();
      console.log("Issue created:", issue._id);
    } else {
      console.log("Issue already exists:", issue._id);
    }

    // 4. Verify password hashing.
    const passwordIsValid = await user.comparePassword(
      process.env.SEED_USER_PASSWORD
    );

    console.log("Password verification:", passwordIsValid);

    // 5. Verify relationships using populate().
    const savedIssue = await Issue.findById(issue._id)
      .populate("project", "name")
      .populate("createdBy", "name email")
      .populate("assignee", "name");

    console.log("\nVerified issue relationships:");
    console.log("Issue:", savedIssue.title);
    console.log("Project:", savedIssue.project.name);
    console.log("Created by:", savedIssue.createdBy.name);
    console.log("Assigned to:", savedIssue.assignee.name);

    console.log("\nDevTrack database seeding completed!");

  } catch (error) {
    console.error("Database seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

seedDatabase();
