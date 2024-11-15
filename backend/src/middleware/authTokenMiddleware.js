import jwt from "jsonwebtoken";

// @note: rmmb to add this header to protected route:  'Authorization': `Bearer ${accessToken}`
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (!accessToken) {
        return res.sendStatus(401);
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(403);
        }
        req.user = user.userID;
        next();
    })
}