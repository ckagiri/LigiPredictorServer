module.exports = {

  // Production specific configuration
  // =================================

  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
      process.env.IP || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT || 8080,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGOLAB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
          'mongodb://ckagiri:redwire@ds159880.mlab.com:59880/ligi'
    }
}