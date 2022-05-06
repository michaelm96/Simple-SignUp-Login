const { User } = require("../models");
const { generateToken } = require("../helpers/generateToken");
const { OAuth2Client } = require("google-auth-library");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const config = require("config");
const moment = require("moment");
const Cryptr = require("cryptr");
const axios = require("axios");
const sequelize = require("sequelize");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const feLink = process.env.FRONTEND_LINK;
const fromEmail = process.env.FROM_EMAIL;
const emailPass = process.env.EMAIL_PASS;
const cryptrKey = process.env.CRYPTR_KEY;
const client = new OAuth2Client(CLIENT_ID);
const cryptr = new Cryptr(cryptrKey);

class UserController {
  static async register(req, res) {
    const { email, password } = req.body;
    try {
      const isExist = await User.findOne({
        where: {
          email,
        },
      });

      if (isExist) {
        return res.status(400).json({
          message:
            "You have registered, please check your email to verify your account, or try to login",
          error: false,
        });
      }

      const user = await User.create({
        email,
        password,
        name: "",
        lastSession: new Date(),
      });

      await UserController._sendEmail(user);

      return res.status(201).json({
        message: "Register Succeed",
        error: false,
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async resend(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          message: "You never register with us, please register first",
          error: false,
        });
      }

      await UserController._sendEmail(user);

      return res.status(200).json({
        message: "Resend Succees, please check your email",
        error: false,
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async _sendEmail(user) {
    try {
      const html = await fs.promises.readFile(
        path.resolve(config.get("verify")),
        "utf8"
      );

      const encode = cryptr.encrypt(
        JSON.stringify({ name: user.name, email: user.email, id: user.id })
      );

      const template = handlebars.compile(html);
      const replacements = {
        link: feLink + "/redirect/" + encode,
      };

      const htmlToSend = template(replacements);

      const msg = {
        to: user.email,
        from: fromEmail,
        subject: "Email verification",
        text: "your email verification",
        html: htmlToSend,
      };

      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: fromEmail,
          pass: emailPass,
        },
      });

      const info = await transport.sendMail(msg);
      console.log("Email sent: " + info.response);
    } catch (error) {
      throw error;
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({
          message: "Invalid email or password",
          error: true,
        });
      }

      if (!user.isVerified) {
        return res.status(307).json({
          message: "User not verified",
          error: true,
          response: {
            isVerified: user.isVerified,
          },
        });
      }

      await User.update(
        { loggedInTimes: user.loggedInTimes + 1, lastSession: new Date() },
        { where: { id: user.id } }
      );
      const access_token = generateToken(user);
      return res.status(200).json({
        message: "Login Succeeed",
        error: false,
        response: {
          access_token,
        },
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async googleLogin(req, res) {
    const { idToken } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let user = await User.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        user = await User.create({
          email: payload.email,
          password: "oauth",
          isVerified: true,
          name: payload.name,
          lastSession: new Date(),
          loggedInTimes: 1,
        });
      } else {
        await User.update(
          { loggedInTimes: user.loggedInTimes + 1, lastSession: new Date() },
          { where: { id: user.id } }
        );
      }

      const access_token = generateToken(user);
      return res.status(201).json({
        message: "Google Login Succeed",
        error: false,
        response: {
          access_token,
        },
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async facebookLogin(req, res) {
    const { token, email } = req.body;
    try {
      const data = await axios.get(
        `https://graph.facebook.com/me?access_token=${token}`
      );

      let user = await User.findOne({
        where: { email },
      });

      if (!user) {
        user = await User.create({
          email,
          password: "oauth",
          isVerified: true,
          name: data.data.name,
          lastSession: new Date(),
        });
      } else {
        await User.update(
          { loggedInTimes: user.loggedInTimes + 1, lastSession: new Date() },
          { where: { id: user.id } }
        );
      }

      const access_token = generateToken(user);
      return res.status(201).json({
        message: "Facebook Login Succeed",
        error: false,
        response: {
          access_token,
        },
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async oldPassDisabled(req, res) {
    const { id } = req.userData;
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          error: false,
        });
      }

      // when the user signed up using google/facebook their password is equal to oauth
      if (user.password === "oauth") {
        return res.status(200).json({
          message:
            "This field is disabled because you signed up using other method",
          error: false,
          response: {
            disable: true,
          },
        });
      }

      return res.status(200).json({
        message: "keep enable",
        error: false,
        response: {
          disable: false,
        },
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const allUser = await User.findAll({
        attributes: [
          "id",
          "name",
          "email",
          "loggedInTimes",
          "lastSession",
          "createdAt",
        ],
      });
      return res.status(200).json({
        message: "Successfully retrieve data",
        error: false,
        response: allUser,
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async getUser(req, res) {
    const { id } = req.userData;
    try {
      const user = await User.findOne({
        where: { id },
        attributes: ["id", "name", "email", "loggedInTimes", "lastSession"],
      });
      return res.status(200).json({
        message: "Successfully retrieve user data",
        error: false,
        response: user,
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async _verify(id) {
    try {
      const user = await User.update(
        {
          name: `user${id}`,
          isVerified: true,
          loggedInTimes: sequelize.literal('"loggedInTimes" + 1'),
        },
        { where: { id } }
      );

      if (!user) {
        throw {
          message: "user not found",
          error: true,
        };
      }

    } catch (error) {
      throw error;
    }
  }

  static async checkHash(req, res) {
    const { hash } = req.body;
    try {
      // decrypt hash to get user data
      const decryptedString = cryptr.decrypt(hash);
      const user = await JSON.parse(decryptedString);

      await UserController._verify(user.id);

      const access_token = generateToken(user);
      return res.status(200).json({
        message: "Decode Succeed",
        error: false,
        response: {
          access_token,
        },
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async reset(req, res) {
    const { id } = req.userData;
    const { property, value } = req.body;
    try {
      // if the user register using regular email and password do this checking below
      if (property === "password" && value.old !== "oauth") {
        const user = await User.findOne({
          where: { id },
        });
        if (!bcrypt.compareSync(value.old, user.password)) {
          return res.status(400).json({
            message: "Mismatch old password",
            error: true,
          });
        }
      }
      //update the data
      await User.update(
        { [property]: value.new },
        { where: { id }, individualHooks: true }
      );
      return res.status(200).json({
        message: "Successfully reset",
        error: false,
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }

  static async activeSessions(req, res) {
    const { amount } = req.params;
    try {
      const users = await User.findAll({
        where: {
          lastSession: {
            [sequelize.Op.gte]: moment().subtract(amount, "days").toDate(),
          },
        },
      });

      return res.status(200).json({
        message: "Successfully retrieve users",
        error: false,
        response: users,
      });
    } catch (error) {
      console.log(error, "@error");
      return res.status(500).json({
        message: "Error occured",
        error: true,
        response: error,
      });
    }
  }
}

module.exports = UserController;
