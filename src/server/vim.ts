"use server";

type Callback = {
  success: boolean;
  flag: string;
}

import flagConfig from "@/flags.json";
import { cookies } from "next/headers";

const vim_sudo_user = "G2CHF1maHG697HyToeYI";
const vim_shell_set = "lGe4SyLgNb90aZLuusy2";
const trueVal = "fr5ruWd851frHjSB61y5";

export async function executeVimCommand(name: string): Promise<Callback> {
  const cookieStore = await cookies();
  const sudoValue = cookieStore.get(vim_sudo_user);
  const shellSetValue = cookieStore.get(vim_shell_set);

  const sudo = sudoValue == undefined ? false : sudoValue.value === trueVal;
  const shellSet = shellSetValue == undefined ? false : shellSetValue.value === trueVal;

  const _flag = flagConfig.find(x => x.id === "vim");
  if (!_flag) {
    return {
      success: false,
      flag: ""
    }
  }

  const _flagEscalate = flagConfig.find(x => x.id === "vim_escalate");
  if (!_flagEscalate) {
    return {
      success: false,
      flag: ""
    }
  }

  if (name == ":set shell=/bin/sh" || name == ":set shell=/bin/bash") {
    cookieStore.set(vim_shell_set, trueVal);

    return {
      success: false,
      flag: "",
    }
  }

  if (sudo && shellSet && name == ":shell") {
    return {
      success: true,
      flag: _flagEscalate.content,
    }
  }

  if (name == ":exit" || name == ":q") {
    cookieStore.delete(vim_sudo_user);
    cookieStore.delete(vim_shell_set);

    return {
      success: true,
      flag: "exit",
    }
  }

  if (name == ":s" || name == ":w" || name == ":help") {
    return {
      success: true,
      flag: _flag.content,
    }
  }

  return {
    success: true,
    flag: "",
  }
}