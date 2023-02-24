module.exports = {
  apps : [{
    script: 'bin/www',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'dimnab',
      host : 'gcp-bawang',
      ref  : 'origin/master',
      repo : 'https://github.com/yolobi/backend-bawang.git',
      path : '/home/dimnab/backend-bawang',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
