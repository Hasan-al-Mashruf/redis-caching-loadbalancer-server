import redis from "../../redis.js";
import User from "../models/userModel.js";
import createError from "../utils/createError.js";
import updateCache from "../utils/updateCache.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const newUser = await User.create({ name, email, age });
    redis.del("users");
    res.status(201).json(newUser);
  } catch (error) {
    next(createError(error.message, 400));
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    await updateCache("users", users);
    res.status(200).json(users);
  } catch (error) {
    next(createError(error.message, 400));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError("User not found", 400));
    const key = `user:${user._id}`;
    await updateCache(key, user);
    res.status(200).json(user);
  } catch (error) {
    next(createError(error.message, 400));
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  await redis.del(key);
  await redis.del("users");
  try {
    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Check if the user exists after update
    if (!updatedUser) return next(createError("User not found", 400));
    const key = `user:${id}`;
    await redis.del(key);
    await redis.del("users");
    res.status(200).json(updatedUser);
  } catch (error) {
    next(createError(error.message, 400));
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return next(createError("User not found", 400));
    const key = `user:${id}`;
    await redis.del(key);
    await redis.del("users");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
