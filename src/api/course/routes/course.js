"use strict";

/**
 * course router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::course.course");

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
    path: "/courses/:id/email",
    handler: "api::course.course.sendMail",
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);

// module.exports = createCoreRouter("api::course.course");
