const express = require("express");
const UserModel = require('../models/userModel'); 
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const matchPassword=require("../models/userModel")

const loginController = expressAsyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const user = await UserModel.findOne({ name }); 
    // console.log("Fetched user data:", user);

    if (user && (await user.matchPassword(password))) {  
        res.json( {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
       
    } else {
        res.status(401);
        throw new Error("Invalid username or password");
    }
});

const registerController = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400); 
        throw new Error("Please fill in all fields");
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        res.status(400); 
        throw new Error("User already exists");
    }

    const userNameExist = await UserModel.findOne({ name });
    if (userNameExist) {
        res.status(400); 
        throw new Error("Username already taken");
    }

    const user = await UserModel.create({ name, email, password });
    
    if (user){
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin:user.isAdmin,
        token: generateToken(user._id),
    });
}
else{
    res.status(400);
    throw new Error ("Registration Error")
}
});

const fetchUsersController = expressAsyncHandler(async(req,res)=>{
    const keyword = req.query.search 
    ?{
        $or:[
            {name:{$regex: req.query.search, $options: 'i'} },
            {email:{$regex: req.query.search, $options: 'i'} },
        ],
    }:{};
    const users = await UserModel.find(keyword).find({
        _id:{$ne: req.user._id},
    });
    res.send(users)
})




module.exports = { loginController,fetchUsersController, registerController };