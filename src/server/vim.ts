"use server";

type Callback = {
  success: boolean;
  flag: string;
}

import flagConfig from "@/flags.json";

export async function executeVimCommand(name: string): Promise<Callback> {
  const _flag = flagConfig.find(x => x.id === "vim");
  if (!_flag) {
    return {
      success: false,
      flag: ""
    }
  }

  if (name == ":set shell=/bin/sh" || name == ":set shell=/bin/bash") {
    return {
      success: true,
      flag: _flag.content,
    }
  }

  if (name == ":exit") {
    return {
      success: true,
      flag: "exit",
    }
  }

  return {
    success: true,
    flag: "",
  }
}