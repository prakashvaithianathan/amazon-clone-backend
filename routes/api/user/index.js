const router = require("express").Router();
const { userModel } = require("../../../models");
const { productModel } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { authentication } = require("../../../library");
const { Mongoose } = require("mongoose");

const sender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/", (req, res) => {
  res.send("this is user rotue");
});

router.post("/signup", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    req.body.password = hash;
    const user = await userModel.create(req.body);

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

    const composeMail = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Mail from amazon",
      html: `
        <div>
        <p><b>Hi, ${
          req.body.firstName + " " + req.body.lastName
        }</b>. We welcome to our platform</p>
        <p>To verify your account, click below</p>
        <a href="http://localhost:3000/verify/${token}">Click Here</a>
        </div>
        `,
    };

    sender.sendMail(composeMail, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("mail sended successfully" + data.response);
      }
    });
    res.json({
      message: "Account successfully created. Please verify your account",
    });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    
    const data = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await userModel.findByIdAndUpdate(
      { _id: data.userId },
      { verified: true }
    );
    res.json({ message: "User verified successfully. Now, you can Login" });
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.verified) {
      return res.status(401).json({ message: "User not Verified" });
    }
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
        return res.status(200).json({ token });
      } else {
        return res.status(403).json({ message: "Wrong Password" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/data", authentication, async (req, res) => {
  try {
    const data = await userModel
      .findById({ _id: req.userId })
      .select("firstName lastName email cartItems -_id");
    res.json({ data });
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
});

router.post("/addItem", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const { userId } = jwt.verify(token, process.env.SECRET_KEY);

    const addProduct = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $addToSet: { cartItems: req.body } },
      { new: true }
    );

    res.json(addProduct);
  } catch (error) {
    return res.json({ message: error.message });
  }
});

router.put("/deleteItem", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const { userId } = jwt.verify(token, process.env.SECRET_KEY);
    const deleteItem = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: { cartItems: { id: req.body.id } },
      },
      { new: true }
    );
    res.json(deleteItem);
  } catch (error) {
    return res.json({ message: error.message });
  }
});

router.put("/addQty", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const { userId } = jwt.verify(token, process.env.SECRET_KEY);
    const data = await userModel.findById({ _id: userId });
    const a = data.cartItems.map((item, i) => {
      if (i === req.body.index) {
        return {
          id: item.id,
          qty: req.body.defaults,
          price: item.price
        };
      }
      return {
        id: item.id,
        qty: item.qty,
        price: item.price
      };
    });
     
    const abs = await userModel.findByIdAndUpdate(
      { _id: userId },
      { cartItems: a } ,
      { new: true }
    );
   res.json(abs)
  } catch (error) {
    return res.json({ message: error.message });
  }
});




router.get('/purchasedItem',async(req,res)=>{
  try {
    
    const token = req.headers['authorization']
    const {userId} = jwt.verify(token,process.env.SECRET_KEY)
    
    const {cartItems} = await userModel.findById({_id: userId}).select('cartItems').select('-_id')
    
   
    const purchased = await userModel.findByIdAndUpdate({_id:userId},{
      $addToSet:{purchasedItems:cartItems}
    },{new:true})
    const getId = cartItems.map(item=>item.id)
    const getName = await productModel.find({_id:getId}).select('name').select('-_id')
    const mergeName = getName.map(item=>item.name)
    
    const composeMail = {
      from: process.env.EMAIL,
      to: purchased.email,
      subject: "Mail from amazon",
      html: `
        <div>
        <p><b>Hi, ${
          purchased.firstName + " " + purchased.lastName
        }</b>. You purchased ${mergeName} </p>
        <p>Thank you for your purchase</p>
        
        </div>
        `,
    };

    sender.sendMail(composeMail, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("mail sended successfully" + data.response);
      }
    });




    
    res.json({message:'purchased successfull'})
  } catch (error) {
    return res.json(error.message)
  }
})



module.exports = router;
