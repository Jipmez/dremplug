"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userId" });
      this.hasMany(models.comments, { foreignKey: "postsId" });
    }
  }
  posts.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      tags: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: true },
      comment_no: { type: DataTypes.INTEGER, allowNull: true },
      views: { type: DataTypes.INTEGER, allowNull: true },
      featured: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  return posts;
};
