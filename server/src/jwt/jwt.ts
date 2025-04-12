import * as jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

const payload = {
    user_id : "test_id",
    role : "USER",
};

export const generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '3h' });

  return token;
};

const refreshToken = (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const payload = {
        userId: decoded.userId,
        isAdmin: decoded.isAdmin,
      };

      const newToken = generateToken(payload);
      return newToken;
    }
    catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

export default {generateToken, refreshToken}