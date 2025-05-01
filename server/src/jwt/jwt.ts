import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

const payload = {
    user_id : "test_id",
    role : "USER",
};

export const generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '3h', algorithm: "HS256" });

  return token;
};

const refreshToken = (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY, {complete:true});

      const payload = {
        userId: decoded.payload["userId"],
        isAdmin: decoded.payload["isAdmin"],
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