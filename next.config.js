/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, options) => {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        }

        // config.module.rules.push({
        //     test: /pdf\.js$/,
        //     loader: 'babel-loader',
        //     options: {
        //         presets: ['@babel/preset-env'],
        //         plugins: ['@babel/plugin-proposal-private-property-in-object'],
        //     },
        // })
        return config
    },
}

module.exports = nextConfig
