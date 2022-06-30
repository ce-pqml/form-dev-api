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
      try {
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

        if (
          !signature.signature &&
          signature.present === null &&
          attendee.email
        ) {
          await strapi.plugins["email"].services.email.sendTemplatedEmail(
            {
              to: attendee.email,
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

        ctx.body = {
          data: {
            type: "success",
            msg: "Email envoyé avec succès.",
          },
          meta: {},
        };
      } catch (error) {
        ctx.body = {
          data: null,
          error: {
            status: 500, // HTTP status
            name: "ApplicationError", // Strapi error name ('ApplicationError' or 'ValidationError')
            message: "Une erreur est survenu lors de l'envoi de l'email.", // A human reable error message
            details: error,
          },
          meta: {},
        };
      }
    },
  })
);
