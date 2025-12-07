import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// on l' utiilise seulement pour hacher le refreshtoken stocké dans la bd  afin d' eviter les fuite de donné au cas ou un hacker a acces au bd
export const hashToken = async (token) => {
    return await bcrypt.hash(token, 10);
};

//verification de refresh token haché
export const verifyHashedToken = async (token, hashedToken) => {
    return await bcrypt.compare(token, hashedToken);
};