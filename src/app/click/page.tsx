"use client";
import { Button } from "@/components/ui/button";
import { socket } from "@/services/socketClient";
import { useEffect, useState } from "react";

export default function Click() {
  const room = 123;
  const count = 1;
  const username = "MAnish";
  const [ncount, setNcount] = useState();
  useEffect(() => {
    socket.on("user_joined", (message) => {
      console.log("user Joined ----------");
    });

    socket.on("updated_count", (newCount) => {
      setNcount(newCount);
    });

    return () => {
      socket.off("user_joined");
      socket.off("join_room");
    };
  }, []);
  async function handleClick() {
    console.log("Clicked");
    socket.emit("join_room", { room, username });
    socket.emit("increment");
  }
  return (
    <main className="h-screen w-full flex justify-center items-center bg-[#161616]">
      <p className="font-bold text-lg m-4 text-white">{ncount}</p>
      <Button onClick={handleClick} variant={"secondary"}>
        Click
      </Button>
    </main>
  );
}
