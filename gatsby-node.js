const fetch = require(`node-fetch`);

exports.onCreatePage = async ({ page, actions: { createPage, deletePage } }) => {
  deletePage(page);

  function humanize(str) {
    if (!str) {
      return str;
    }
    let i;
    const frags = str.split('_');
    for (i = 0; i < frags.length; i += 1) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }
  const response = await fetch(process.env.GATSBY_ADS_API_URL);
  let { advertisments } = await response.json();
  advertisments = advertisments.map((ad) => ({
    created: ad.created,
    date: ad.date,
    description: ad.description,
    gardenArea: ad.garden_area,
    houseArea: ad.house_area,
    id: ad.id,
    localization: humanize(ad.localization),
    name: ad.name,
    pictureUrl: ad.picture_url,
    price: ad.price,
    ref: ad.ref,
    source: humanize(ad.source),
    type: ad.type,
    url: ad.url,
  }));
  createPage({
    ...page,
    context: {
      ...page.context,
      advertisments,
    },
  });
};
