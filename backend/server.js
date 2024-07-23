import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import http from "http";

const app = express();

const server = http.createServer(app);


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("*", (req, res) => {
	res.send("Server is up and running");
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
