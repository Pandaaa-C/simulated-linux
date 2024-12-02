"use server";

import commandsConfig from "@/commands.json";
import flagConfig from "@/flags.json";
import fileContentConfig from "@/file-content.json";

type Callback = {
  command: string;
  response: string[];
  path: string;
}

export async function executeCommand(name: string, path: string): Promise<Callback> {
  const args = name.split(" ");
  if (name === "sudo -l") {
    return sudoLCommand(path);
  } else if (name === "sudo vim") {
    return sudoVimCommand();
  }
  const command = commandsConfig.find((c) => c.name == args[0]);
  if (!command) {
    return {
      command: name,
      path: path,
      response: [`Command not found: ${name}`],
    }
  }

  switch (args[0]) {
    case "ls": return lsCommand(path);
    case "clear": return clearCommand(path);
    case "help": return helpCommand(path);
    case "cat": return catCommand(path, args);
    case "cd": return cdCommand(args[1]);
  }

  return {
    command: name,
    path: path,
    response: ["Executed command: " + name],
  };
}

function getFilesByPath(path: string): string[] {
  if (path === "/") {
    return ["index.html", "style.css", "script.js", "flag.txt"];
  }

  if (path === "/etc" || path === "/etc/") {
    return ["passwd"];
  }

  return [];
}

function lsCommand(path: string): Callback {
  const flag = flagConfig.find(x => x.id === "ls");
  if (flag) {
    return {
      command: "ls",
      path: path,
      response: [`${flag.content}`, ...getFilesByPath(path)],
    };
  }

  return {
    command: "ls",
    path: path,
    response: getFilesByPath(path),
  };
}

function clearCommand(path: string): Callback {
  return {
    command: "clear",
    path: path,
    response: [""],
  };
}

function helpCommand(path: string): Callback {
  return {
    command: "help",
    path: path,
    response: [
      "Available commands:",
      ...commandsConfig.map((command) => `  ${command.name}  |  ${command.description}  |  Usage: ${command.usage}`),
    ]
  }
}

function catCommand(path: string, args: string[]): Callback {
  const command = commandsConfig.find(x => x.name === "cat");
  if (!command) {
    return {
      command: "cat",
      path: path,
      response: ["Command not found: cat"]
    }
  }

  const existingFiles = ["index.html", "style.css", "script.js", "flag.txt", "passwd"];

  if (args.length > 1) {
    const flag = flagConfig.find(x => x.id === args[0]);
    if (!flag || !existingFiles.includes(args[1])) {
      return {
        command: "cat " + args[1],
        path: path,
        response: ["No such file or directory"]
      }
    }

    const fileContent = fileContentConfig.find(x => x.name === args[1]);
    if (!fileContent) {
      return {
        command: "cat " + args[1],
        path: path,
        response: ["File not found"]
      }
    }

    return {
      command: "cat " + args[1],
      path: path,
      response: [`${flag?.content}`, ...fileContent.content]
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
      response: ["No such file or directory"]
    }
  }

  return {
    command: "cd " + path,
    path: path,
    response: [""]
  }
}

function sudoLCommand(path: string): Callback {
  return {
    command: "sudo -l",
    path: path,
    response: ["User 'user' may run the following commands on local:", "  (ALL) NOPASSWD: /usr/bin/vim"]
  }
}

function sudoVimCommand(): Callback {
  return {
    command: "sudo vim",
    path: "/",
    response: ["Vim: Warning: Input is not from a terminal"]
  }
}
