import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator"

//login user
const loginUser = async (req, res) => {
  const frontend_url = "https://u09-fullstack-js-jemalnejat-frontend.onrender.com"
  const {email,password} = req.body;
  try {
     const user = await userModel.findOne({email});
     if (!user) {
      return res.json({success: false, message: "User dose not exists"})
     }
     
     const isMatch = await bcrypt.compare(password, user.password);

     if (!isMatch) {
      return res.json({success: false, message: "Invalid creadentials"})
     }
     const token = createToken(user._id, user.role);
     res.json({success:true,token})
  
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})

  }
};

const createToken = (id, role) => {
    return jwt.sign({id, role},process.env.JWT_SECRET);
}

//register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //checking is user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    //validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email!" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
       name:name,
       email:email,
       role:"user",
       password:hashedPassword 
    })
    const user = await newUser.save()
    const token = createToken(user._id, user.role)
    res.json({success:true,token})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})

  }
};

export { loginUser, registerUser };
