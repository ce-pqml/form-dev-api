"use strict";

/**
 * signature router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::signature.signature");

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: "GET",
    path: "/:id/email",
    handler: "api::signature.signature.sendMail",
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);

// module.exports = createCoreRouter("api::signature.signature");
