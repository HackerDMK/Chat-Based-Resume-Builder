import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (user) => {
	const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	return token;
}

export default generateTokenAndSetCookie;
