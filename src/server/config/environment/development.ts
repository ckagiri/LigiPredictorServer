module.exports = {

  // Development specific configuration
  // ==================================
  port: process.env.PORT || 3030,
  mongo: {
    uri: 'mongodb://localhost:27017/ligi-dev'
  }
}