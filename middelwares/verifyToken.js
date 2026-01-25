import jwt from 'jsonwebtoken';


function verifyToken(req, res, next) {
    console.log("--- Auth Debug Start ---");
    console.log("Cookies received:", req.cookies); // Check if 'token' is here
    try {
    
        const token = req.cookies.token;
        if(!token){
            throw new Error('token not found');
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            throw new Error('Unauthorized');
        }

        req.user = decoded;
        
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export default verifyToken;