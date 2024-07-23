import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import axios from "axios";

export const googleLogin = async (req, res) => {
	try {
		const { code } = req.body;
		if (!code) {
			return res.status(400).json({ message: "Bad Request" });
		}

		const response = await axios.post(
			'https://oauth2.googleapis.com/token',
			{
				code,
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				redirect_uri: 'postmessage',
				grant_type: 'authorization_code'
			}
		);
		const accessToken = response.data.access_token;

		const userResponse = await axios.get(
			'https://www.googleapis.com/oauth2/v3/userinfo',
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		const userDetails = userResponse.data;

		let user
		user = await
			User.findOne
				({
					email
						: userDetails.email
				})
		if (!user) {
			user = new User({
				name: userDetails.name,
				email: userDetails.email,
				image: userDetails.picture,
			});
			await user.save();
		}

		const token = generateTokenAndSetCookie(user);
		res.json({ jwt: token });
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
}