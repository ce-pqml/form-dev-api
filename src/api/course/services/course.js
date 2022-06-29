"use strict";

/**
 * course service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::course.course", ({ strapi }) => ({
  async find(...args) {
    const { results, pagination } = await super.find({
      ...args,
      populate: {
        signatures: {
          populate: {
            attendee: {
              populate: {
                attendee_comments: true,
              },
            },
          },
        },
        course_comments: {
          populate: {
            speaker: true,
          },
        },
        speakers: true,
      },
    });

    return { results, pagination };
  },
  async findOne(ctx, params) {
    return strapi.query("api::course.course").findOne({
      where: {
        id: ctx,
      },
      ...params,
      populate: {
        signatures: {
          populate: {
            attendee: {
              populate: {
                attendee_comments: true,
              },
            },
          },
        },
        course_comments: {
          populate: {
            speaker: true,
          },
        },
        speakers: true,
      },
    });
  },
}));
