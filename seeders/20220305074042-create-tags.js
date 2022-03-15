const tag = require("../config/app.configuration").tags;
("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    tags = tag.map((r) => {
      r.createdAt = new Date();
      r.updatedAt = new Date();
      return r;
    });

    return queryInterface.bulkInsert("tags", tags, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("tags", null, {});
  },
};
