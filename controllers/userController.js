import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// Function to generate JWT token
// const generateToken = (user) => {
//     const JWT_SECRET = process.env.JWT_SECRET;
//     return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
// };

const generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET; // Fetch secret from .env file
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    // Generate the token with user data (user._id, user.email)
    return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
};


// Register a new user
export const registerUser = async (req, res) => {
    const { fullName, email, phone, password } = req.body;

    try {
        // Check if email or phone already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(409).json({ error: "User with this email or phone already exists." });
        }

        // Create and save a new user
        const user = new User({ fullName, email, phone, password });
        await user.save();

       // Generate token for the new user
const token = generateToken(user);

res.status(201).json({
    message: "User registered successfully",
    token,
    userId: user._id,
    success: true,
});

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email." });

        // Check if password is correct
        const validPassword = await user.isPasswordCorrect(password);
        if (!validPassword) return res.status(400).json({ error: "Invalid password." });

        // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            id: user._id,
            email: user.email,
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: err.message,
        });
    }
};

// Update a user
export const updateUsers = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone, password } = req.body;

    try {
        const updateData = { fullName, email, phone };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to update user",
            error: err.message,
        });
    }
};

// Delete a user
export const deleteUsers = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // ID from the decoded JWT token

    if (id !== userId) {
        return res.status(403).json({ error: "You do not have permission to delete this user" });
    }

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully", data: user });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user", message: err.message });
    }
};