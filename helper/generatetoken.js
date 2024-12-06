require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = async (id) => {
  try {
    return jwt.sign(
      { id: id },
      "MESS SOFTWARE",
      { algorithm: "HS256" },
      { expiresIn: "24h" }
    );
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

module.exports = generateToken;
