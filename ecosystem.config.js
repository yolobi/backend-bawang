const { watch } = require('./app/blanko2/model');

module.exports = {
  apps: [
    {
      name: 'app1',
      script: './app.js',
      watch: false,
    },
  ],
};
