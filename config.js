var config = {}

config.port = 19983;

config.apiUrl = '//api.domain.com';
config.apiPostUrl = 'https://localhost:1122';
config.refererUrl = 'https://backend.domain.com';
config.loginUrl = 'https://auth.domain.com/lock';

config.crypto = {};
config.crypto.algorithm = 'abc123';
config.crypto.password = 'abc123';

config.cookie = {};
config.cookie.password = 'abc123';
config.cookie.expire = 86400000*365; //365 Day (1000*3600*24)

module.exports = config;