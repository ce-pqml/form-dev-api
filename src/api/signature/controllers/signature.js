// @ts-nocheck
"use strict";

/**
 *  signature controller
 */
const fs = require("fs");
const path = require("path");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::signature.signature",
  ({ strapi }) => ({
    async sendMail(ctx) {
      const { id } = ctx.params;
      const result = await strapi
        .service("api::signature.signature")
        .findOne(id, {
          populate: {
            attendee: true,
            course: true,
          },
        });

      const signature = result;
      const attendee = signature.attendee;
      const course = signature.course;

      const emailTemplate = {
        subject: "Demande de signature - <%= course.title %>",
        text: "Test",
        html: fs.readFileSync(
          path.join(
            __dirname,
            "..",
            "..",
            "..",
            "email",
            "signature_template.html"
          ),
          "utf8"
        ),
      };

      await strapi.plugins["email"].services.email.sendTemplatedEmail(
        {
          to: process.env.SMTP_DEFAULT_MAIL,
        },
        emailTemplate,
        {
          course,
          attendee,
          signature,
        }
      );

      // await strapi.plugins["email"].services.email.send({
      //   to: env("SMTP_DEFAULT_MAIL"),
      //   from: env("SMTP_DEFAULT_MAIL"),
      //   replyTo: env("SMTP_DEFAULT_MAIL"),
      //   subject: "Demande de signature - " + course.title,
      //   html: "Hello world!",
      // });

      ctx.body = { msg: "ok" };
    },
  })
);
