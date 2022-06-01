export type SearchEngines = {
   [key: string]: {
      title: string,
      queryUrl: string,
      icon: string
   }
};

export type Commands = {
   [key: string]: {
      params: string[];
      desciption?: string;
      // validate?: (params: { [key: string]: any }) => Promise<{ [key: string]: any } | false>;
      validate: string,
      // execute: (params: { [key: string]: any }) => Promise<void>;
      execute: string;
   }
};