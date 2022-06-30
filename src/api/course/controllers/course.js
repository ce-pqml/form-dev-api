// @ts-nocheck
"use strict";

/**
 *  course controller
 */

const fs = require("fs");
const path = require("path");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::course.course", ({ strapi }) => ({
  async sendMail(ctx) {
    try {
      const { id } = ctx.params;
      const result = await strapi.service("api::course.course").findOne(id);

      const course = result;
      const signatures = course.signatures;

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

      for (let index = 0; index < signatures.length; index++) {
        const signature = signatures[index];
        const attendee = signature.attendee;

        if (!signature.signature && signature.present === null) {
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
          const today = new Date();
          await strapi
            .service("api::signature.signature")
            .update(signature.id, {
              data: {
                date: null,
                date_limit: today.setHours(
                  today.getHours() + process.env.DEFAULT_LIMIT_SIGNATURE / 60
                ),
              },
            });
        }
      }

      ctx.body = {
        data: {
          type: "success",
          msg: "Emails envoyés avec succès.",
        },
        meta: {},
      };
    } catch (error) {
      ctx.body = {
        data: null,
        error: {
          status: 500, // HTTP status
          name: "ApplicationError", // Strapi error name ('ApplicationError' or 'ValidationError')
          message: "Une erreur est survenu lors de l'envoi des mails.", // A human reable error message
          details: error,
        },
        meta: {},
      };
    }
  },
}));
