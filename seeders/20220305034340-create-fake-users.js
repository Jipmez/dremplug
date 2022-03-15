"use strict";

const { HashService } = require("../src/services/hash.service");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "users",
      [
        {
          uuid: "3c30c327-820c-4ba2-8320-29e2a9wqee42bf",
          email: "jane@admin.com",
          name: "admin",
          password: await new HashService("dreams").encode(),
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: "6ty30c327-820c-4ba2-8320-29e2a9wqee42bf",
          email: "jane@editor.com",
          name: "Janeditor",
          password: await new HashService("dreams").encode(),
          role: "editor",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: "7uc30c327-820c-4ba2-8320-29e2a9wqee42bf",
          email: "john@editor.com",
          name: "Joneditor",
          password: await new HashService("dreams").encode(),
          role: "editor",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('users', null, {});
     */
  },
};
