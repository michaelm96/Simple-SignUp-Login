const { User } = require("../models");

const authorization = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await User.findOne({ where: { id } });
    if (!data) {
      return res.status(404).json({
        message: "User not found",
        error: false,
      });
    } else if (data.id !== req.userData.id) {
      return res.status(403).json({
        message: "Forbidden access",
        error: false,
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error, "@autho error");
    return res.status(500).json({
      message: "Error occured",
      error: true,
      response: error,
    });
  }
};

module.exports = authorization;
