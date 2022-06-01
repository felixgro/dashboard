const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
   alias({
      '@commands': 'src/lib/commands'
   })(config);

   return config;
};