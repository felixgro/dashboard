type CommandConfig = {
   description?: string;
   params?: string[];
   validate?: (params: { [key: string]: any }) => Promise<{ [key: string]: any }>;
   run: (params: { [key: string]: any }) => Promise<void>;
}

export default function createCommand(id: string, config: CommandConfig) {
   return new Command(id, config);
}

class Command {
   constructor(
      private id: string,
      private config: CommandConfig
   ) { }
}