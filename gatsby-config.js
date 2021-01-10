require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        appendScript: require.resolve(`${__dirname}/src/notification-sw.js`),
        workboxConfig: {
          runtimeCaching: [
            {
              // page-data.json files, static query results and app-data.json
              // are not content hashed
              urlPattern: /^https?:.*\/page-data\/.*\.json/,
              handler: `NetworkFirst`,
            },
          ],
        },
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
