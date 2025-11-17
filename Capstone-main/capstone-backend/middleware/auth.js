const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, "NoVuaK7GUNteIQNixag9rRa+JejLByINXfXqv7RwOnA=", (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
