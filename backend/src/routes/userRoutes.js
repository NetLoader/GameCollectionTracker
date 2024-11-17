import express from "express";
import { createUser, deleteUser, getUserByID, getUsers, updateUserPassword } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authTokenMiddleware.js";
import bcrypt from "bcrypt";


const router = express.Router();

//getusers
// @ex: /users?limit=5&offset=0
/* router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const users = await getUsers(limit, offset);
        res.json(users);
    } catch (error) {
        res.status(500).json({message: "Error fetching users", error});
    }
}); */

//getUserByID
// @ex: /users/12
/* router.get("/:id", async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await getUserByID(userID);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: "User not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching user by id", error});
    }
}); */

//createUser
router.post("/", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const user = await createUser(username, email, password);
        if (user) {
            res.status(200).json({message: "User created"});
        } else {
            res.status(409).json({message: "Account with the same email exist"});
        }
    } catch (error) {
        res.status(500).json({message: "Error creating user", error});
    }
});

//updateUserPassword
router.put("/", authenticateToken, async (req, res) => {
    try {
        const {userID, oldPassword, newPassword} = req.body;
        if (userID != req.user) {
            return res.status(403).json({message: `You are not authorized to update this user's data`});
        }

        const user = await getUserByID(userID);
        const verifyPassword = await bcrypt.compare(oldPassword, user.user_password_hash);
        if (!verifyPassword){
            return res.status(401).json({message: "Invalid password"})
        }

        const result = await updateUserPassword(userID, newPassword);
        if (result) {
            res.status(200).json({message: "User updated"});
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error updating user", error});
    }
});

//deleteUser
router.delete("/", authenticateToken, async (req, res) => {
    try {
        const {userID} = req.body;
        if (userID != req.user) {
            return res.status(403).json({message: "You are not authorized to delete this user's data"});
        }
        
        const user = await deleteUser(userID);
        if (user) {
            res.status(200).json({message: "User deleted"});
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error deleting user", error});
    }
});


export default router;