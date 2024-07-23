import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return res.status(401).json({ message: "No authorization token provided" });
		}
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "Bearer token not provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ message: "Invalid token" });
		}

		const user = await User.findById(decoded._id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Not authorized, token failed" });
	}
};

export default protectRoute;
