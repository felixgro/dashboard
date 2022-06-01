import createCommand from '../src/lib/command';

export default createCommand('hello', {
   description: 'Say hello to someone',
   params: ['name', 'repeat?'],

   async validate({ name, repeat }) {
      if (!repeat) repeat = 1;
      return { name, repeat };
   },

   async run({ name, repeat }) {
      console.log(`Hello ${name}!`);
   }
});