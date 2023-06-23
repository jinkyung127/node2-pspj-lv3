const express = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../models");
const router = express.Router();

// 회원가입 API
router.post("/signup", async (req, res) => {
  try {
    const { nickname, password } = req.body;
    // 닉네임 형식 검사
    if (!/^[a-zA-Z0-9]{3,}$/.test(nickname)) {
      res.status(412).json({
        errorMessage:
          "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성됨",
      });
      return;
    }
    // 비밀번호 형식 검사
    if (password.length < 4) {
      res.status(412).json({
        errorMessage: "비밀번호는 최소 4자 이상입니다.",
      });
      return;
    }
    // 패스워드에 닉네임이 포함되어 있는지 검사
    if (password.includes(nickname)) {
      res.status(412).json({
        errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
      });
      return;
    }
    // 닉네임 중복 검사
    const isExistUser = await users.findOne({ where: { nickname } });

    if (isExistUser) {
      return res.status(412).json({ message: "중복된 닉네임입니다." });
    }

    // Users 테이블에 사용자를 추가
    const user = await users.create({ nickname, password });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 로그인 API
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await users.findOne({ where: { nickname } });
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: "닉네임 또는 패스워드를 확인해주세요." });
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    "customized_secret_key"
  );
  // 쿠키 발급
  res.cookie("authorization", `Bearer ${token}`);
  // response 할당
  return res.status(200).json({ message: "로그인 성공" });
});

// 사용자 조회
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await users.findOne({
    attributes: ["id", "nickname", "createdAt", "updatedAt"],
    where: { id },
  });

  return res.status(200).json({ data: user });
});

module.exports = router;
