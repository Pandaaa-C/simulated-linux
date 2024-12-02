"use client";

import { cn } from "@/lib/utils";
import { executeVimCommand } from "@/server/vim";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VimPage() {
  const router = useRouter();
  const [command, setCommand] = useState<string>("");
  const [flag, setFlag] = useState<string>("");

  const onSubmit = async () => {
    if (command.length <= 0) return;
    setCommand("");

    const response = await executeVimCommand(command);
    if (response.flag === "exit") {
      router.push("/");
    }

    if (response.flag && response.success) {
      setFlag(response.flag);
    }
  }

  const keyHandle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await onSubmit();
    }
  };

  return (
    <div className={cn("min-h-screen p-10")}>
      <div className={cn("h-[700px] bg-[#36454F] p-2 rounded flex flex-col overflow-hidden")}>
        <div className={cn("flex-1 overflow-y-auto flex flex-col-reverse")}>
          <p>VIM EDITOR!</p>
          <p>{flag}</p>
        </div>
        <div className={cn("h-[10%] max-h-[10%] w-full flex items-center")}>
          <p>
            {" "}
          </p>
          <input
            type="text"
            placeholder=""
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
  )
}
