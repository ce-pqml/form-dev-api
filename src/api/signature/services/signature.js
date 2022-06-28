'use strict';

/**
 * signature service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::signature.signature');
