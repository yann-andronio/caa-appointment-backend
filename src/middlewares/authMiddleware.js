import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            // Vérifie la validité du token et récupère le payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Récupère l'user correspondant (sans le password)
            req.user = await User.findById(decoded.id).select('-password');
            // passe au controller suivant
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // pas de token fourni
    return res.status(401).json({ message: 'Not authorized, no token' });
};
