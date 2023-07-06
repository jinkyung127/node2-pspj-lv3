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

      // 1. Posts 모델에서
      this.belongsTo(models.users, {
        // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: "id", // 3. Users 모델의 userId 컬럼을
        foreignKey: "userId", // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });

      // 1. Posts 모델에서
      this.hasMany(models.comments, {
        // 2. Comments 모델에게 1:N 관계 설정을 합니다.
        sourceKey: "id", // 3. Posts 모델의 postId 컬럼을
        foreignKey: "postId", // 4. Comments 모델의 PostId 컬럼과 연결합니다.
      });

      this.hasMany(models.likes, {
        sourceKey: "id",
        foreignKey: "postId",
      });
    }
  }

  posts.init(
    {
      id: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  return posts;
};
