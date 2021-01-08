require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        appendScript: require.resolve(`${__dirname}/src/notification-sw.js`),
      },
      workboxConfig: {
        runtimeCaching: [
          {
            urlPattern: /(\.js$|\.css$|static\/)/,
            handler: `CacheFirst`,
          },
          {
            urlPattern: /^https?:.*\/page-data\/.*\/(page-data|app-data)\.json$/,
            handler: `NetworkFirst`,
            options: {
              networkTimeoutSeconds: 1,
            },
          },
          {
            urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
            handler: `StaleWhileRevalidate`,
          },
          {
            urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
            handler: `StaleWhileRevalidate`,
          },
          {
            urlPattern: /\/$/,
            handler: `NetworkFirst`,
            options: {
              networkTimeoutSeconds: 1,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Maisons & terrains du Cap Sizun`,
        short_name: `Annonces Cap Sizun`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#215177`,
        display: `standalone`,
        icon: 'src/images/favicon.png',
      },
    },
  ],
};
