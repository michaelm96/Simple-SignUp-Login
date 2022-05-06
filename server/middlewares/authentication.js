const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const { User } = require("../models");

const authentication = async (req, res, next) => {
  const access_token = req.headers.authentication;
  if (!access_token) {
    return res.status(403).json({
      message: "Forbidden Access",
      error: false,
    });
  }
  try {
    const decoded = jwt.verify(access_token, secretKey);
    req.userData = decoded;
    await User.update(
      { lastSession: new Date() },
      { where: { id: decoded.id } }
    );
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error ocurred",
      error: true,
      response: error,
    });
  }
};

module.exports = authentication;
