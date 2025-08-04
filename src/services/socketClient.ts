"use client";
import { io } from "socket.io-client";
const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000" // or your local socket server
    : "https://chat-production-1abf.up.railway.app";
export const socket = io(URL);
