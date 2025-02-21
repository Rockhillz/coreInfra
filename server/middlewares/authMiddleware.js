const jwt = require('jsonwebtoken');

// exports.authMiddleware = (req, res, next) => {

//     const token = req.header('Authorization');
//     console.log("Received token:", token);


//     if (!token) {
//         return res.status(401).json({ message: 'Access Denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;  // Attach user info to request
//         console.log("Decoded user:", decoded);
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid Token' });
//     }
// };

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. No token provided or incorrect format.' });
    }

    const token = authHeader.split(' ')[1]; // Extract actual token

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

