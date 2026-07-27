import { io } from "socket.io-client";

const socket = io("https://watch-party-backend-kdua.onrender.com");

export default socket;