const secret = {
  accessTokenExpiresIn: new Date(Date.now() + 20 * 60 * 1000),
  refreshTokenExpiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

export default secret;
