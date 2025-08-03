"use client";
import { socket } from "@/services/socketClient";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const handleUserJoined = (data: any) => {
      console.log("User joined: hello");
    };
    socket.on("user_joined", handleUserJoined);
    return () => {
      socket.off("user_joined");
    };
  }, []);
  return (
    <div className="h-full w-full flex justify-center items-center">
      <button className="cursor-pointer">Click</button>
    </div>
  );
}
