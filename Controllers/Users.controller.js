const usersdb = require("../Models/users.model");
const jwt = require("jsonwebtoken");
const { emailIdCheck, hashingPasswords,confirmPasswordCheck } = require("../Utils/userUtils");

module.exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  let data = null;
  if (!name && !email && !password && !emailIdCheck(email)) {
    return res.status(400).json({
      ok: false,
      message: "Invalid Request",
    });
  }
  try {
    if (await usersdb.findOne({ email: email })) {
      return res.status(409).json({
        ok: false,
        message: "User Already exists in the system",
      });
    }
    const newPassword = await hashingPasswords(password, salt);
    data = await usersdb.create({
      name: name,
      email: email,
      password: newPassword,
    });
    if (data) {
      return res.status(201).json({
        ok: true,
        message: "User Added Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Internal error please try again later",
    });
  }
};

module.exports.changePassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    if (confirmPasswordCheck(password,confirmPasswordCheck)) {
      return res.status(405).json({
        ok: false,
        message: "Passwords are invalid",
      });
    }
    const user = await usersdb.findOne({ email: email });
    if (user) {
      const newPassword = await hashingPasswords(password, salt);
      await user.update({ password: newPassword });
      return res.status(200).json({
        ok: true,
        message: "Password Updated Successfully",
      });
    } else {
      return res.status(404).json({
        ok: false,
        message: "invalid Email ID",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Internal error please try again later",
    });
  }
};

module.exports.signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersdb.findOne({ email: email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        ok: false,
        message: "Invalid username or password",
      });
    }
    return res.status(200).json({
      message: "Sign in successful, here is your token, please keep it safe!",
      data: {
        ok: true,
        token: jwt.sign({ userId: user._id }, process.env["SECRET"], {
          expiresIn: "24h",
        }),
        userId: user.id,
        userName: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Internal server error",
    });
  }
};
