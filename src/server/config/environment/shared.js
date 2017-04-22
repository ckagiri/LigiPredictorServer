module.exports = {
    api_providers: {
        api_football_data: {
            name: 'API_FOOTBALL_DATA',
            apiKey: '43ef278ba6484fd786fe5d3339871c6c'
        },
        sports_open_data: {
            name: 'SPORTS_OPEN_DATA',
            apiKey: ''
        }
    },
    // OAuth 2.0
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'ligi123predictor456',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '41314d248fddfc3a03bcb61147f7114d',
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'V1JEeIkU_40xMVtJ1J34rfLA',
    // OAuth 1.0
    TWITTER_KEY: process.env.TWITTER_KEY || 'vdrg4sqxyTPSRdJHKu4UVVdeD',
    TWITTER_SECRET: process.env.TWITTER_SECRET || 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA'
};
//# sourceMappingURL=shared.js.map