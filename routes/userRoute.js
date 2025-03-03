import express from "express";
import {
  authenticateToken,
  signupValidation,
  loginValidation,
} from "../middleware/authenticateToken.js";
import {
  registerUser,
  loginUser,
  updateUsers,
  deleteUsers
} from "../controllers/userController.js";

import UserModel from "../models/UserModel.js";

const router = express.Router();

// Routes for user authentication and management
router.post("/signup", signupValidation, registerUser);
router.post("/login", loginValidation, loginUser);

// Get all users
router.get("/get-users", (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

// Update and delete user routes
router.put("/updateuser/:id", authenticateToken, updateUsers);
router.delete("/deleteuser/:id", authenticateToken, deleteUsers);

// Export the router as the default export
export default router;