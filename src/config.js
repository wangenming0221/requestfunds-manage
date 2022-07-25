let config = {
    dev: require('./config/dev.config').default,
    beta: require('./config/beta.config').default,
    pro: require('./config/pro.config').default,
};

module.exports = config[process.env.VUE_APP_ENV_TYPE || 'beta'];
