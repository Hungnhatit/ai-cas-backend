import JWT from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export const createJWT = (id) => {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '5d'
  })
}

export const createToken = (payload, expiresIn) => {
  return JWT.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn
  });
}

// hàm dùng để mã hoá chuỗi
export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(useValue, salt);
  return hashedPassword;
}

// Compare string function
export const compareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

// JSON webtoken
export function createJWT(id) {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5d",
  });
}