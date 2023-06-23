"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        validate: {
          len: {
            args: [3, 255],
            msg: "닉네임은 최소 3자 이상입니다.",
          },
          is: {
            args: /^[a-zA-Z0-9]+$/,
            msg: "닉네임은 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성되어야 합니다.",
          },
        },
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          len: {
            args: [4, 255],
            msg: "비밀번호는 최소 4자 이상입니다.",
          },
          isNotEqualNickname(value) {
            if (value === this.nickname) {
              throw new Error(
                "비밀번호에는 닉네임과 같은 값이 포함될 수 없습니다."
              );
            }
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
