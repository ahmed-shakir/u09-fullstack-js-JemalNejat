import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator"

//login user
const loginUser = async (req, res) => {
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
     const token = createToken(user._id); 
     res.json({success:true,token})
  
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})

  }
};
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
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
    const token = createToken(user._id)
    res.json({success:true,token})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})

  }
};
// Admin login function
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body; // Get the email and password from the request body

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        // Check if the password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        // Check if user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Not an admin." });
        }

        // Create a JWT token with user info, including role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with token and user role
        res.json({ success: true, token, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};






  




export { loginUser, registerUser,fetchAllUsers };
