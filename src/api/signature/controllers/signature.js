"use strict";

/**
 *  signature controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::signature.signature",
  ({ strapi }) => ({
    async sendMail(ctx) {
      console.log("sendMail");
      // const { id } = ctx.params;
      // const entries = await strapi.db.query("api::hello.hello").findMany();
      await strapi.plugins["email"].services.email.send({
        to: "charleselie.piquemal@gmail.com",
        from: "test@strapi.io",
        replyTo: "test@strapi.io",
        subject: "Use strapi email provider successfully",
        html: "Hello world!",
      });

      console.log("end");
      ctx.body = { msg: "ok" };
    },
  })
);
