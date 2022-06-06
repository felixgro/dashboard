export type CommandConfig = {
   aliases?: string[];
   params?: string[];
   description?: string;
   validate?: (params: { [key: string]: any }) => Promise<{ [key: string]: any }>;
   run: (params: { [key: string]: any }) => Promise<void>;
}

export default class Command {

   private _queryParams: string[] = [];
   private _suggestion = "";

   constructor(
      private _id: string,
      private _config: CommandConfig
   ) { }

   get suggestion(): string {
      return this._suggestion;
   }

   public isCommandQuery(query: string): boolean {
      const queryParts = query.split(' ');
      const isQuery = this._id === queryParts[0] || Boolean(this._config.aliases?.includes(queryParts[0]));
      if (isQuery) this._queryParams = queryParts.slice(1);
      return isQuery;
   }

   public matchQuery(query: string): boolean {
      const firstWord = query.split(' ')[0];
      if (firstWord.length === 0) return false;

      const idMatch = this._id.startsWith(firstWord);
      const aliasMatch = this._config.aliases?.find(a => a.startsWith(firstWord));
      if (!idMatch && !aliasMatch) {
         return false;
      }

      this._suggestion = idMatch ?
         this._id.replace(firstWord, '') :
         aliasMatch!.replace(firstWord, '');

      if (this._config.params) {
         this._suggestion += ' ' + this._config.params.map(p => '<' + p + '>').join(' ');
      }
      console.log('could be command!');
      return true;
   }

   public async execute(): Promise<void> {
      if (!this._config.params || this._config.params.length === 0) {
         return this._config.run({});
      }

      let params = this._config.params.reduce<{ [key: string]: any }>((acc, param, idx) => {
         const paramRequired = !param.endsWith('?');
         if (paramRequired && (this._queryParams[idx] === undefined || this._queryParams[idx].length === 0)) {
            throw new Error(`Missing required parameter ${param} `);
         }
         if (!paramRequired) param = param.slice(0, -1);
         acc[param] = this._queryParams[idx];
         return acc;
      }, {});

      if (this._config.validate) params = await this._config.validate(params);

      return this._config.run(params);

   }
}