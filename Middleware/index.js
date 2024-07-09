import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import { expired, serverError, signUp } from "../Responses/index.js";

// Middleware to check if user is logged in
export const isLoggedIn = (req, res, next) => {
  try {
    const token =
      req.headers?.authorization?.split(" ")[1] || req.cookies?.authToken;
    const userId = req.headers?.id ?? req.headers?.id;
    if (userId === null || !token || token === undefined) {
      return res.status(signUp.status).send(signUp);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded?.id !== userId) {
        return res.status(expired.status).send(expired);
      }
      return next();
    });
  } catch (err) {
    console.log(err);
    return res.status(serverError.status).send(serverError);
  }
};
export const isAdmin = async (req, res, next) => {
  let id = req.headers?.id;
  const user = await User.findById(id);
  if (user.type !== "admin") {
    return res.status(403).json({ message: "Access denied, not an admin" });
  }
  next();
};
