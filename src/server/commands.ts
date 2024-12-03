"use server";

import commandsConfig from "@/commands.json";
import flagConfig from "@/flags.json";
import fileContentConfig from "@/file-content.json";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Callback = {
  command: string;
  response: string[];
  path: string;
}

const vim_sudo_user = "G2CHF1maHG697HyToeYI";
const vim_shell_set = "lGe4SyLgNb90aZLuusy2";
const trueVal = "fr5ruWd851frHjSB61y5";

export async function executeCommand(name: string, path: string): Promise<Callback> {
  const args = name.split(" ");
  const command = commandsConfig.find((c) => c.name == args[0]);
  if (!command) {
    return {
      command: name,
      path: path,
      response: [`Command not found: ${name}`, ""],
    }
  }

  switch (args[0]) {
    case "ls": return lsCommand(path, args[1]);
    case "clear": return clearCommand(path);
    case "help": return helpCommand(path);
    case "cat": return catCommand(path, args);
    case "cd": return cdCommand(args[1]);
    case "find": return findCommand(path, args);
    case "vim": await vimCommand(); break;
    case "sudo": return await sudoLCommand(path, args[1]);
  }

  return {
    command: name,
    path: path,
    response: ["Executed command: " + name, ""],
  };
}

function getFilesByPath(path: string, more: boolean): string[] {
  if (path === "/" && more) {
    return ["-rw-rw-r-- 1 user user 20 index.html", "-rw-rw-r-x 1 user user 152 style.css", "-rx-rw-rw- 1 user user 1 script.js", "-r--r--r-- 1 root root 2 flag.txt", "-rwxr-xr-x 1 root root 1943 get-all-flags.sh"];
  }

  if (path === "/") {
    return ["index.html", "style.css", "script.js", "flag.txt", "get-all-flags.sh"];
  }

  if (path === "/etc" || path === "/etc/") {
    return ["passwd"];
  }

  return [];
}

function lsCommand(path: string, args: string): Callback {
  const flag = flagConfig.find(x => x.id === "ls");
  if (flag && args === "-la") {
    return {
      command: "ls -la",
      path: path,
      response: [`${flag.content}`, ...getFilesByPath(path, true), ""],
    };
  }

  return {
    command: "ls",
    path: path,
    response: [...getFilesByPath(path, false), ""]
  }
}

function clearCommand(path: string): Callback {
  return {
    command: "clear",
    path: path,
    response: ["", ""],
  };
}

function helpCommand(path: string): Callback {
  return {
    command: "help",
    path: path,
    response: [
      "Available commands:",
      ...commandsConfig.map((command) => `  ${command.name}  |  ${command.description}  |  Usage: ${command.usage}`)
      , ""
    ]
  }
}

function catCommand(path: string, args: string[]): Callback {
  const command = commandsConfig.find(x => x.name === "cat");
  if (!command) {
    return {
      command: "cat",
      path: path,
      response: ["Command not found: cat", ""]
    }
  }

  const existingFiles = ["index.html", "style.css", "script.js", "flag.txt", "passwd", "get-all-flags.sh"];

  if (args.length > 1) {
    const flag = flagConfig.find(x => x.id === args[0]);
    if (!flag || !existingFiles.includes(args[1])) {
      return {
        command: "cat " + args[1],
        path: path,
        response: ["No such file or directory", ""]
      }
    }

    const fileContent = fileContentConfig.find(x => x.name === args[1]);
    if (!fileContent) {
      return {
        command: "cat " + args[1],
        path: path,
        response: ["File not found", ""]
      }
    }

    return {
      command: "cat " + args[1],
      path: path,
      response: [`${args[1] == "get-all-flags.sh" ? flag.content : ""}`, ...fileContent.content, ""]
    }
  }

  return {
    command: "cat",
    path: path,
    response: [command.usage]
  }
}

const cdPaths = ["/", "/etc", "/etc/"];

function cdCommand(path: string): Callback {
  if (path === null || path === undefined) {
    return {
      command: "cd",
      path: path,
      response: [""]
    }
  }

  if (!path.startsWith("/") || !path) {
    return {
      command: "cd",
      path: path,
      response: [""]
    }
  }

  if (!cdPaths.includes(path)) {
    return {
      command: "cd " + path,
      path: "/",
      response: ["No such file or directory", ""]
    }
  }

  return {
    command: "cd " + path,
    path: path,
    response: [""]
  }
}

async function sudoLCommand(path: string, args: string): Promise<Callback> {
  if (args === "vim") {
    return await sudoVimCommand();
  } else if (args === "-l") {
    return {
      command: "sudo -l",
      path: path,
      response: ["User 'user' may run the following commands on local:", "  (ALL) NOPASSWD: /usr/bin/vim", ""]
    }
  }

  return {
    command: "sudo",
    path: path,
    response: ["sudo <command>", ""]
  }
}

async function vimCommand(): Promise<void> {
  redirect("/vim");
}

async function sudoVimCommand(): Promise<Callback> {
  const cookieStore = await cookies();
  cookieStore.set(vim_sudo_user, trueVal);

  redirect("/vim");
}

function findCommand(path: string, args: string[]): Callback {
  const command = commandsConfig.find(x => x.name === "find");
  if (!command) {
    return {
      command: "find",
      path: path,
      response: ["Command not found: find", ""]
    }
  }
  const pathToFind = args[1];
  const fileSerach = args[2];
  const fileToFind = args[3];
  const fileExtensionSearch = args[4];
  const fileExtensionToFind = args[5];

  const flag = flagConfig.find(x => x.id === "find");
  if (!flag) {
    return {
      command: "find " + pathToFind + " " + fileSerach + " " + fileToFind + " " + fileExtensionSearch + " " + fileExtensionToFind,
      path: path,
      response: [`No flag found`, ""]
    }
  }

  if (pathToFind !== "/" || fileSerach !== "-name" || fileExtensionSearch !== "-type") {
    return {
      command: "find",
      path: path,
      response: ["find: missing arguments. Usage: " + command.usage, ""]
    }
  }

  if (fileToFind === "flag" && (fileExtensionToFind === "txt" || fileExtensionToFind === ".txt")) {
    return {
      command: "find " + pathToFind + " " + fileSerach + " " + fileToFind + " " + fileExtensionSearch + " " + fileExtensionToFind,
      path: path,
      response: [`${flag.content}`, `/root/flag.txt`, `/flag.txt`, `/usr/sbin/getrickrolled/flag.txt`, ""]
    }
  }

  return {
    command: "find ",
    path: path,
    response: ["find: : No such file or directory", ""]
  }
}
