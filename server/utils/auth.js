const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = (context) => {
  const { req } = context;
  let token;

  // Check if the request has the token in the headers
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ').pop().trim();
  }

  if (!token) {
    throw new AuthenticationError('You have no token!');
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    context.user = data;
  } catch (err) {
    console.log('Invalid token');
    throw new AuthenticationError('Invalid token!');
  }
};

module.exports = { authMiddleware };
