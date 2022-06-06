import createCommand from '../lib/commands';

export default createCommand('hello', {
   aliases: ['hi', 'ola'],
   params: ['name', 'repeat?'],
   description: 'Say hello to someone',

   async validate({ name, repeat }) {
      if (name === 'world') throw new Error('You cannot say hello to the world');
      if (!repeat) repeat = 1;
      return { name, repeat };
   },

   async run({ name, repeat }) {
      for (let i = 0; i < repeat; i++) {
         console.log(`Hello ${name}!`);
      }
   }
});