import type { SearchEngines, Commands } from "../types/settings";
import { FC, FormEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import SearchEngineSelection from './SearchEngineSelection';

type Props = {
   commands: Commands;
   defaultEngine: string;
   searchEngines: SearchEngines;
}

const MainInput: FC<Props> = ({ commands, defaultEngine, searchEngines }) => {
   const input = useRef<HTMLInputElement>(null);
   const [query, setQuery] = useState("");
   const [engine, setEngine] = useState<any>(searchEngines[defaultEngine]);

   const handleQuerySubmit: FormEventHandler = (evt) => {
      evt.preventDefault();

      const queryParts = query.split(" ");

      // try to find command using first word of query
      const commandTuple = Object.entries(commands).find(([key, value]) => {
         return queryParts[0] === key;
      });

      if (!commandTuple) {
         const url = engine.queryUrl.replace("%query%", query);
         window.location = url;
         return;
      }

      const command = commandTuple[1];
      const executor = eval(`async (params) => { ${command.execute} }`);

      // execute command straight away if no params required
      if (!command.params || command.params.length === 0) {
         executor({});
      }

      // received query params
      const params = queryParts.slice(1);

      // validate params & remove optional flags
      let didError = false;
      const cleanParamNames = command.params.map((param, idx) => {
         const isRequired = param.slice(-1) !== '?';

         // if param is required and not provided -> show error & abort
         if (isRequired && (!params[idx] || params[idx].length === 0)) {
            console.error(`parameter ${param} is missing`);
            didError = true;
         }

         // remove optional flag from param
         if (!isRequired)
            param = param.slice(0, -1);

         return param;
      });

      // abort if error occured
      if (didError) return;

      // build params object for custom validation & execution
      let paramsObj = cleanParamNames.reduce<{ [key: string]: any }>((acc: { [key: string]: any }, param: string, idx: number) => {
         acc[param] = params[idx];
         return acc;
      }, {});

      (async () => {
         // if custom validation is defined, execute it
         if (command.validate) {
            const validator = eval(`async (params) => { ${command.validate} }`);
            const validatorResult = await validator(paramsObj);
            if (!validatorResult) return;
            paramsObj = validatorResult;
         }

         // execute command
         await executor(paramsObj);
      })();
   };

   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
      if (!input.current) return;
      input.current.focus();
   }, []);

   useEffect(() => {
      if (isOpen) setIsOpen(false);
   }, [query]);

   return (
      <form className="mainForm" onSubmit={handleQuerySubmit}>
         <SearchEngineSelection isOpen={isOpen} onSelect={(newEngine) => {
            setEngine(searchEngines[newEngine]);
            setIsOpen(false);
            input.current!.focus();
         }} />

         <button type="button" onClick={() => setIsOpen(prev => !prev)}>
            <img src={engine.icon} alt={engine.title} height="32" width="32" />
         </button>
         <input
            type="text"
            role="search"
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
         />
      </form>
   );
};

export default MainInput;