import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import checkCache from "../middleware/checkCache.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", checkCache("users"), getUsers);
router.get("/:id", checkCache("user"), getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
