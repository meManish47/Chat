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
type Message = {
  message: string;
  sender: string;
};
export default function Home() {
  const [joined, setJoined] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string | undefined>(undefined);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
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
    const handlesendMessage = (data: {
      room: string;
      message: string;
      sender: string;
    }) => {
      console.log("Sender message:", data.message);
      setMessages((prev) => [
        ...prev,
        { message: data.message, sender: data.sender },
      ]);
    };
    socket.on("system_message", handleSystemMessage);
    socket.on("send_message", handlesendMessage);
    return () => {
      socket.off("user_joined");
    };
  }, []);
  console.log(room, username);
  function handleClick() {
    socket.emit("join_room", { room, username });
    setJoined(true);
  }
  function handleSend() {
    socket.emit("send_message", { room, message: text, sender: username });
  }
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#161616]">
      {!joined ? (
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
      ) : (
        <div className="flex flex-col h-[80%]">
          <div className="h-[70%] w-150 bg-[#090909] flex flex-col justify-between overflow-y-auto relative">
            <div className="h-[90%] w-full pb-24">
              {messages.map((msg, i) => {
                return (
                  <div
                    key={i}
                    className="bg-[#1755ac] rounded p-2 flex flex-col w-40 h-16 mb-2"
                  >
                    <div className="text-sm text-gray-400">{msg.sender}</div>
                    <div className="p-1 text-base text-white">
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-[10%] w-full flex sticky top-0">
            <input
              className="h-full w-full px-4 rounded-2xl bg-white placeholder:text-gray-500"
              placeholder="Enter message..."
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></input>
            <Button
              className="h-full bg-[#252525] text-white"
              variant={"outline"}
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
        </div>
      )}
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
