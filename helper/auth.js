const jwt = require("jsonwebtoken");
const secreteKey ={jwt_secreteKey:"secreteKey"};

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      const token = header.split(" ")[1];
      
      
      const isVerified = jwt.verify(token, secreteKey.jwt_secreteKey);
      
      if (isVerified) {
        req["userId"] = isVerified._id;
        next();
      } else {
        res.status(400).json({
          message: "Unauthorised access",
        });
      }
    } catch (error) {
      console.log("=====================",error.message);

      res.status(400).json({
        message: "Invalid credential",
      });
    }
  },
};
