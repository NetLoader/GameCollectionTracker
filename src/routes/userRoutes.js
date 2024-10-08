import express from "express";
import { createUser, deleteUser, getUserByID, getUsers, updateUser } from "../controllers/userController.js";
const router = express.Router();

//getusers
// @ex: /users?limit=5&offset=0
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const users = await getUsers(limit, offset);
        res.json(users);
    } catch (error) {
        res.status(500).json({message: "Error fetching users", error});
    }
});

//getUserByID
// @ex: /users/12
router.get("/:id", async (req, res) => {
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
});

//createUser
router.post("/", async (req, res) => {
    try {
        const user = await createUser(req.body);
        if (user) {
            res.status(200).json({message: "User created"});
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error creating user", error});
    }
});

//updateUser
router.put("/:id", async (req, res) => {
    try {
        const user = await updateUser(req.body, req.params.id);
        if (user) {
            res.status(200).json({message: "User updated"});
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error updating user", error});
    }
});

//deleteUser
router.delete("/:id", async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
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