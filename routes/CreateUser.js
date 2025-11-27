// import express from "express";
// import User from "../models/User.js";
// import { body, validationResult } from "express-validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// const jwtSecret = "MynameisEndtoEndDeveloperGoSuccess";



// const router = express.Router();


// router.post("/createuser", [
//     body('email').isEmail(),
//     body('name').isLength({ min: 5 }),
//     body('password', "require min 5 ").isLength({ min: 5 })
// ],

//     async (req, res) => {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.json({ errors: errors.array() });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const secPassword = await bcrypt.hash(req.body.password,salt)

//         try {
//             await User.create({
//                 name: req.body.name,
//                 password: secPassword,
//                 email: req.body.email,
//                 location: req.body.location
//             })
//             res.json({ success: true });
            
//         } catch (error) {
//             console.log(error)
//             res.json({ success: false })
//         }
//     });

// router.post("/loginuser", [
//     body('email').isEmail(),
//     body('password', "Incorrect Password ").isLength({ min: 5 })
// ],

//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.json({ errors: errors.array() });
//         }

//         let email = req.body.email;



//         try {
//             let userData = await User.findOne({ email });
//             if (!userData) {
//                 return res.json("Try logging in with correct email");
//             }

//             let pwdCompare = await bcrypt.compare(req.body.password,userData.password)

//             if (!pwdCompare) {
//                 return res.json("Try logging in with correct password");
//             }

//                  const data = {
//             user :{
//                 id:userData.id
//             }
//                  }


//            const authToken = jwt.sign(data,jwtSecret)
//           return res.json({success:true,authToken:authToken})



//         } catch (error) {
//             console.log(error)
//             res.json({ success: false })
//         }

        




//     }
// );


// export default router;
import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = "MynameisEndtoEndDeveloperGoSuccess";
const router = express.Router();

// -------- MIDDLEWARE ----------
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied. No token." });

  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ error: "Admins only" });
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// -------- SIGNUP ----------
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password", "Password min 5 chars").isLength({ min: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });

    try {
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
        role: req.body.role || "user" // default to user
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  }
);

// -------- LOGIN ----------
router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "Password min 5 chars").isLength({ min: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const userData = await User.findOne({ email });
      if (!userData) return res.json({ success: false, error: "Incorrect email" });

      const pwdCompare = await bcrypt.compare(password, userData.password);
      if (!pwdCompare) return res.json({ success: false, error: "Incorrect password" });

      const data = { user: { id: userData.id } };
      const authToken = jwt.sign(data, jwtSecret);

      return res.json({
        success: true,
        authToken,
        role: userData.role
      });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  }
);

// -------- ADMIN DASHBOARD ----------
router.get("/admin/dashboard", fetchUser, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "name email location role date");
    res.json({ users, totalUsers: users.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;
