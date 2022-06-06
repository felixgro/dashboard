import type { SearchEngines } from "../types/settings";
import type Command from "src/lib/commands/Command";
import { FC, FormEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import SearchEngineSelection from './SearchEngineSelection';
import toast from "react-hot-toast";

type Props = {
   commands: Command[];
   defaultEngine: string;
   searchEngines: SearchEngines;
}

const MainInput: FC<Props> = ({ commands, defaultEngine, searchEngines }) => {
   const [query, setQuery] = useState("");
   const [engine, setEngine] = useState<any>(searchEngines[defaultEngine]);

   const [isOpen, setIsOpen] = useState(false);

   const input = useRef<HTMLInputElement>(null);
   const suggs = useRef<HTMLInputElement>(null);

   useEffect(() => {
      input.current!.focus();
   }, []);

   useEffect(() => {
      if (isOpen) setIsOpen(false);

      const command = commands.find((command) => command.matchQuery(query));
      console.log(command);
      if (command) {
         suggs.current!.value = query + command.suggestion
      } else {
         suggs.current!.value = "";
      };
      // eslint-disable-next-line
   }, [query]);

   const handleQuerySubmit: FormEventHandler = (evt) => {
      evt.preventDefault();
      console.log('submit');

      // check if the first word is a command
      const command = commands.find((command) => command.isCommandQuery(query));

      if (command) {
         toast.promise(command.execute(), {
            loading: 'Executing Command..',
            success: 'Command executed successfully',
            error: (err) => err.message,
         });
         return;
      };

      // use query if no command found
      window.location = engine.queryUrl.replace("%query%", query);
   };

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

         <div className="mainInput">
            <input
               type="text"
               ref={suggs}
               disabled={true}
            />
            <input
               type="text"
               role="search"
               ref={input}
               value={query}
               onChange={(e) => setQuery(e.target.value)}
            />
            <input type="submit" />
         </div>

      </form>
   );
};

export default MainInput;