import Command, { CommandConfig } from "./Command";

export default function createCommand(id: string, config: CommandConfig): Command {
   return new Command(id, config);
}