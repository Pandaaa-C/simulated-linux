"use server";

import commandsConfig from "@/commands.json";
import flagConfig from "@/flags.json";

type Callback = {
  command: string;
  response: string[];
}

export async function executeCommand(name: string): Promise<Callback> {
  const args = name.split(" ");
  const command = commandsConfig.find((c) => c.name == args[0]);
  if (!command) {
    return {
      command: name,
      response: [`Command not found: ${name}`],
    }
  }

  switch (args[0]) {
    case "ls": return lsCommand();
    case "clear": return clearCommand();
    case "help": return helpCommand();
    case "cat": return catCommand(args);
  }

  return {
    command: name,
    response: ["Executed command: " + name],
  };
}

function lsCommand(): Callback {
  const flag = flagConfig.find(x => x.id === "ls");
  if (flag) {
    return {
      command: "ls",
      response: [`${flag.content}`, `index.html   style.css   script.js   flag.txt`],
    };
  }

  return {
    command: "ls",
    response: [`index.html   style.css   script.js    flag.txt`],
  };
}

function clearCommand(): Callback {
  return {
    command: "clear",
    response: [""],
  };
}

function helpCommand(): Callback {
  return {
    command: "help",
    response: [
      "Available commands:",
      ...commandsConfig.map((command) => `  ${command.name}  |  ${command.description}`)
    ]
  }
}

function catCommand(args: string[]): Callback {
  const existingFiles = ["index.html", "style.css", "script.js", "flag.txt"];

  if (args.length > 1) {
    const flag = flagConfig.find(x => x.id === args[0]);
    if (!flag || !existingFiles.includes(args[1])) {
      return {
        command: "cat " + args[1],
        response: ["No such file or directory"]
      }
    }

    return {
      command: "cat " + args[1],
      response: [`${flag?.content}`]
    }
  }

  return {
    command: "cat",
    response: ["Usage: cat <file>"]
  }
}

