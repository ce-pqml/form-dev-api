"use strict";

/**
 * course service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::course.course", ({ strapi }) => ({
  async findOne(ctx, params) {
    return strapi.query("api::course.course").findOne({
      where: {
        id: ctx,
      },
      ...params,
      populate: {
        signatures: {
          populate: {
            attendee: true,
          },
        },
        speakers: true,
      },
    });
  },
}));
