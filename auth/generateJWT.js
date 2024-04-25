const jwt = require('jsonwebtoken');
require('dotenv').config()

function generateAccessToken({id_profile, usuario, correo}) {
  const user = {id_profile, usuario, correo};
  const optionsAccessToken = { expiresIn: '1d' };
  const optionsRefreshToken = { expiresIn: '90d' };

  const access_token = jwt.sign(user, process.env.ACCESS_JWT_SECRET, optionsAccessToken);
  const refresh_token = jwt.sign(user, process.env.REFRESH_JWT_SECRET, optionsRefreshToken);

  return ({access_token, refresh_token});
}

module.exports = generateAccessToken;