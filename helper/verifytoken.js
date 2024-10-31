const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      "MESS SOFTWARE",
      { algorithms: ["HS256"] },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      }
    );
  });
};

module.exports = verifyToken;
