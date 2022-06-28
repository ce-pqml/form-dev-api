'use strict';

/**
 * signature router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::signature.signature');
