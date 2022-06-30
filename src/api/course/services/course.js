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
    let where = {
      where: {
        id: ctx,
      },
    };
    if (isNaN(ctx)) {
      where = {
        where: {
          key: ctx,
        },
      };
    }
    return strapi.query("api::course.course").findOne({
      ...where,
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
