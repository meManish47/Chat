"use client";
import { socket } from "@/services/socketClient";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
type SystemMessage = {
  message: string;
  timeStamp: Date;
  type: string;
};
export default function Home() {
  const [joined, setJoined] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string | undefined>(undefined);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  useEffect(() => {
    const handleUserJoined = (_data: unknown) => {
      console.log("User joined: hello");
    };
    socket.on("user_joined", handleUserJoined);

    const handleSystemMessage = (data: {
      message: string;
      timeStamp: Date;
      type: string;
    }) => {
      console.log("System message:", data);
      setSystemMessages((prev) => [...prev, data]);
    };
    socket.on("system_message", handleSystemMessage);
    return () => {
      socket.off("user_joined");
    };
  }, []);
  console.log(room, username);
  function handleClick() {
    socket.emit("join_room", { room, username });
    setJoined(true);
  }
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#161616]">
      <Card className="w-full max-w-sm bg-[#3d3d3d00] text-white">
        <CardHeader>
          <CardTitle>Join room</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label>Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username.."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label>Room</Label>
                </div>
                <Input
                  id="room"
                  type="text"
                  required
                  value={room ?? ""}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            onClick={handleClick}
            variant={"secondary"}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
      {/* {joined && (
        <div className="h-30 w-100 my-8 p-2 flex items-center bg-black/60 text-white">
          {username} joined {room}
        </div>
      )} */}
      <div className="bg-black/60 rounded-lg p-4 max-h-60 overflow-y-auto">
        <h3 className="text-white font-semibold mb-2">Room Activity</h3>
        {systemMessages.length === 0 ? (
          <p className="text-gray-400 text-sm">No activity yet...</p>
        ) : (
          <div className="space-y-2">
            {systemMessages.map((msg, index) => (
              <div key={index} className="text-gray-300 text-sm">
                <span className="text-blue-400">
                  [{msg.timeStamp.toLocaleString()}]
                </span>{" "}
                <span className="text-yellow-300">System:</span> {msg.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
