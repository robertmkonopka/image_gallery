import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const token = jwt.sign({ username, password }, process.env.JWT_SECRET);

  res.status(200).json({
    token,
  });
}
