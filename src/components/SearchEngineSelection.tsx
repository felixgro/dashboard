import { FC, useEffect, useRef } from "react";

type Props = {
   isOpen: boolean;
   onSelect: (engine: string) => void;
}

const SearchEngineSelection: FC<Props> = ({ isOpen, onSelect }) => {
   const container = useRef<HTMLDivElement>(null);

   const handleSelection = (evt: Event) => {
      let target = evt.target as Element;
      if (target.nodeName === 'IMG') target = target.parentElement!;
      const engine = target.getAttribute('data-engine')!;
      onSelect(engine);
   }

   useEffect(() => {
      if (!container.current) return;

      const buttons = container.current.querySelectorAll('button')!;

      if (isOpen) {
         const distance = 80;
         const angleStep = 180 / (buttons.length - 1);

         for (let i = 0; i < buttons.length; i++) {
            const angle = angleStep * i * Math.PI / 180 + Math.PI / 2;
            // * -1 because of the order the buttons are positioned -> first in markup is on top
            const x = Math.cos(angle * -1) * distance;
            const y = Math.sin(angle * -1) * distance;
            buttons[i].animate([{
               transform: `translate(${x}px, ${y}px)`
            }], {
               duration: 190,
               easing: 'ease-in-out',
               delay: 60 * i,
            }).addEventListener('finish', () => {
               buttons[i].style.transform = `translate(${x}px, ${y}px)`;
            }, { once: true });

            buttons[i].addEventListener('click', handleSelection);
         }
      } else {
         for (let i = 0; i < buttons.length; i++) {
            buttons[i].animate([{
               transform: `translate(0px, 0px)`
            }], {
               duration: 190,
               easing: 'ease-in-out',
               delay: 60 * i,
            }).addEventListener('finish', () => {
               buttons[i].style.transform = `translate(0px, 0px)`;
            }, { once: true });

            buttons[i].removeEventListener('click', handleSelection);
         }
      }
   }, [isOpen]);

   return (
      <div className="buttons" ref={container}>
         <button type="button" data-engine="google">
            <img src="./icons/google.svg" alt="Google" height="32" width="32" />
         </button>
         <button type="button" data-engine="duckduckgo">
            <img src="./icons/duckduckgo.svg" alt="Duckduckgo" height="32" width="32" />
         </button>
         <button type="button" data-engine="youtube">
            <img src="./icons/youtube.svg" alt="Youtube" height="32" width="32" />
         </button>
         <button type="button" data-engine="twitter">
            <img src="./icons/twitter.svg" alt="Twitter" height="32" width="32" />
         </button>
         <button type="button" data-engine="github">
            <img src="./icons/github.svg" alt="Github" height="32" width="32" />
         </button>
      </div>
   );
}

export default SearchEngineSelection;