const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
      const {name, email, password, contact} = req.body;
      try{
            if(!name || !email || !password || !contact){
                  return res.status(400).json({message: "All fields are required"});
            }
            const existingUser = await User.findOne({email});
            if(existingUser){
                  return res.status(400).json({message: "User already exists"});
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                  name,
                  email,
                  password: hashedPassword,
                  contact
            });
            res.status(200).json({newUser, message: "User created"});
      }
      catch(error){
            res.status(500).json({message: error})
      }
});

router.post("/login", async (req, res) => {
      const {email, password} = req.body;
      try{
            if(!email || !password){
                  return res.status(400).json({message: "All fields are required"});
            }
            const existingUser = await User.findOne({email});
            if(!existingUser){
                  return res.status(404).json({message: "User not found"});
            }
            const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
            if(!isCorrectPassword){
                  return res.status(400).json({message: "Invalid credentials"});
            }
            const token = await jwt.sign({id: existingUser._id, email: existingUser.email, role: existingUser.role}, process.env.SECRET_KEY, {
                  expiresIn: "1d"
            });
            res.status(200).json({token, message: "User logged in successfully"});
      }
      catch(error){
            res.status(500).json({message: error});
      }
})

module.exports = router;