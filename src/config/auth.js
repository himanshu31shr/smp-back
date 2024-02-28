module.exports = () => {
    const config = {
        development: {
            secret: process.env.AUTH_SECRET || 'here\'s a very long secret, that will be between me and me',
            expiration: process.env.AUTH_EXPIRATION || (1200),
            refresh_token_secret: 'here\'s a very long secret for refresh token, that will be between me and me',
            refresh_token_expiration: (60 * 60 * 24 * 7)
        },
        production: {
            secret: process.env.AUTH_SECRET || 'here\'s a very long secret, that will be between me and me',
            expiration: process.env.AUTH_EXPIRATION || (120),
            refresh_token_secret: 'here\'s a very long secret for refresh token, that will be between me and me',
            refresh_token_expiration: (60 * 60 * 24 * 7)
        },
        test: {
            secret: process.env.AUTH_SECRET || 'here\'s a very long secret, that will be between me and me',
            expiration: process.env.AUTH_EXPIRATION || (120),
            refresh_token_secret: 'here\'s a very long secret for refresh token, that will be between me and me',
            refresh_token_expiration: (60 * 60 * 24 * 7)
        }
    }

    return config[process.env.NODE_ENV || 'development'];
}