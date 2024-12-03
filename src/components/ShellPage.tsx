"use client";

import { cn } from "@/lib/utils";
import { executeCommand } from "@/server/commands";
import { useEffect, useRef, useState } from "react";

type CommandResponses = {
  command: string;
  path: string;
  response: string[];
};

export default function ShellPage() {
  const [command, setCommand] = useState<string>("");
  const [responses, setResponses] = useState<CommandResponses[]>([]);
  const [path, setPath] = useState<string>("/");
  const responsesEndRef = useRef<HTMLDivElement | null>(null);

  const onSubmit = async () => {
    if (command.length <= 0) return;

    setCommand("");

    const response = await executeCommand(command, path);
    if (response.command === "clear") {
      setResponses([]);
      return;
    }
    if (response.path == " " || response.path == null || response.path == undefined || response.response[0].startsWith("No such file or directory ")) {
      setPath("/");
    } else if (!response.path.startsWith("/")) {
      setPath("/");
    } else {
      setPath(response.path);
    }

    setResponses((prev) => [...prev, response]);
  };

  const keyHandle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await onSubmit();
    }
  };

  useEffect(() => {
    if (responsesEndRef.current) {
      responsesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  return (
    <div className={cn("min-h-screen p-10")}>
      <div className={cn("h-[700px] bg-[#1E1E1E] p-2 rounded flex flex-col overflow-hidden")}>
        <div className={cn("flex-1 overflow-y-auto flex flex-col-reverse")}>
          <div>
            {responses.map((response, index) => (
              <div key={index}>
                <p><b>[user@local {response.path}]$</b> {response.command}</p>
                {
                  response.response.map((res, i) => (
                    <p
                      key={i}
                      className={cn(
                        (res.startsWith("Command not found:") || res.startsWith("No such file or directory"))
                          ? "text-red-800"
                          : "text-white"
                      )}
                    >
                      {res}
                    </p>
                  ))}
              </div>
            ))}
            <div ref={responsesEndRef} />
          </div>
        </div>
        <div className={cn("h-[10%] max-h-[10%] w-full flex items-center")}>
          <p>
            <b>[user@local {path}]$</b>{" "}
          </p>
          <input
            type="text"
            placeholder=""
            autoFocus
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className={cn(
              "h-[50%] w-[85%] bg-transparent px-2 border-none outline-none"
            )}
            onKeyDown={(e) => keyHandle(e)}
          />
        </div>
      </div>
    </div>
  );
}
