const jwt=require('jsonwebtoken')
const User=require('../models/userModel')

const authMiddleware = async (req,res,next)=>{
    try{
        const token=req.header('Authorization')?.replace('Bearer ', '');

        if(!token)
        {
            return res.status(401).json({message:'Access denied . Notoken provided.'})

        }

        const decoded = jwt.verify(token,"default_secret_key");

        const user = await User.findById(decoded._id);
        if(!user)
        {
            return res.status(404).json({message:'User not found'});
        }

        req.user=user;
        next();

    }

    catch(error)
    {
        console.error(error);
        res.status(400).json({message:'Invalid Token.'})
    }
};

module.exports = authMiddleware;