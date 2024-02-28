module.exports = (env = 'development') => {
  const envs = {
    "development": {
      "username": process.env.DB_USERNAME || "root",
      "password": process.env.DB_PASSWORD || "mysql12345",
      "database": process.env.DB_NAME || "spot_my_pic_dev",
      "host": process.env.DB_HOSTNAME || "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": "mysql12345",
      "database": "spot_my_pic_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": process.env.DB_USERNAME || "root",
      "password": process.env.DB_PASSWORD || "mysql12345",
      "database": process.env.DB_NAME || "spot_my_pic_dev",
      "host": process.env.DB_HOSTNAME || "127.0.0.1",
      "dialect": "mysql"
    }
  };

  return envs[env];
};
