import { Request, Response } from "express";
import { User } from "../../models/userModel";
import generateToken from "../../utils/generateToken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { Otp } from "../../models/otpModel";
import cloudinary from "../../utils/cloudinary";



export const create_user = async (req: Request, res: Response) => {
  try {
    const userExists = await User.findOne({ email:req.body?.email });

    if (!userExists) {

      const OTP = otpGenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nizarp666@gmail.com",
          pass: process.env.EMAIL_PASS,
        },
      });
      var mailOptions = {
        from: '"Connector" <nizarp666@gmail.com>',
        to: req.body.email,
        subject: "OTP VERIFICATION",
        text: "PLEASE ENTER THE OTP FOR VERIFY YOUR EMAIL " + OTP,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error occurred:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      const otps = await Otp.findOne({ email: req.body?.email });
      if (!otps) {
        const otp = new Otp({ email: req.body?.email, otp: OTP });
        await otp.save();
      } else {
        await Otp.updateOne({ email: req.body?.email }, { $set: { otp: OTP } });
      }

      res.status(200).json({
        status:'success',
        message:'otp send to user successfully',
      });
    } else if (userExists.isGoogleLogin == true) {
      res
        .status(402)
        .json({ message: "Already signed up with different Method" });
    } else {
      res.status(409).json({ message: "user already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({message:'Signup failed'});
  }
};


// export const create_google_user = async (req: Request, res: Response) => {
//   try {
//     const { name, email } = req.body;
//     const userExists = await User.findOne({ email });
//     const randomPassword = generatePassword(8, false);
//     if (!userExists) {
//       const newuser = new User({
//         name,
//         email,
//         password: randomPassword,
//         isAdmin: false,
//         isBlocked: false,
//         isProfileFinished: false,
//         isGoogleLogin: true,
//         isVerified: true,
//         registered_on: new Date().toLocaleDateString(),
//       });

//       await newuser.save();
//       const token = generateToken(newuser._id);

//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "nizarp666@gmail.com",
//           pass: process.env.EMAIL_PASS,
//         },
//       });
//       var mailOptions = {
//         from: '"Connector" <nizarp666@gmail.com>',
//         to: newuser.email,
//         subject: "LINGUABLEND PASSWORD",
//         text:
//           "USE THIS PASSWORD WHEN YOU LOGIN TO CONNECTOR " + randomPassword,
//       };
//       transporter.sendMail(mailOptions, function (error, info) {});

//       res.status(200).json({
//         _id: newuser._id,
//         name: newuser.name,
//         email: newuser.email,
//         isGoogleLogin: newuser.isGoogleLogin,
//         token,
//       });
//     } else {
//        if(userExists.isBlocked==true){
//         res.status(403).json({message:'user got blocked by admin'})
//        }
//       const token = generateToken(userExists._id);
//       res.status(200).json({
//         _id: userExists._id,
//         name: userExists.name,
//         email: userExists.email,
//         isGoogleLogin: userExists.isGoogleLogin,
//         isProfileFinished: userExists.isProfileFinished,
//         photo: userExists.photo,
//         token,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400);
//   }
// };

// export const resendOtp=async (req:Request,res:Response)=>{
//   try{
    
//     const {userEmail}=req.body
    
//     const OTP = otpGenerator.generate(4, {
//       digits: true,
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "nizarp666@gmail.com",
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//     var mailOptions = {
//       from: '"Connector" <nizarp666@gmail.com>',
//       to: userEmail,
//       subject: "OTP VERIFICATION",
//       text: "PLEASE ENTER THE OTP FOR VERIFY YOUR EMAIL " + OTP,
//     };
//     transporter.sendMail(mailOptions, function (error, info) {});
//     const otps = await Otp.findOne({ email: userEmail });
   
//     if (!otps) {
//       const otp = new Otp({ email: userEmail, otp: OTP });
//       await otp.save();
//     } else {
//       await Otp.updateOne({ email: userEmail }, { $set: { otp: OTP } });
//     }

//     res.status(200).json({message:'Otp sent successfully'})
//   }catch(error){
//     console.log(error)
//     res.status(400).json({message:'Otp sending failed'})

//   }
// }

// export const clearOtp=async(req:Request,res:Response)=>{
//   try {
//     const {userEmail}=req.body
//     await Otp.deleteOne({email:userEmail})
//     res.status(200).json({message:'otp cleared'})
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({message:'otp clearing failed'})
//   }
// }


export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email,name,password, otp } = req.body;
    const otpexists = await Otp.findOne({ email });
    if (otpexists) {
      if (otpexists.otp == otp) {
        const newuser= new User({
          email,
          name,
          password
        })
        await newuser.save()
        const token = generateToken(newuser?._id);
        res.status(200).json({
          status:'success',
          message:'Otp verified successfully',
          user:newuser,
          token,
        });
      } else {
        res.status(402).json({ message: "Incorrect otp" });
      }
    } else {
      res.status(404).json({ message: "Otp expired" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Otp verification failed" });
  }
};



export const login_user = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPasswords(password))) {
      if (user.isBlocked == false) {
        const token = generateToken(user._id);
        res.status(200).json({
          status:'success',
          message:'user logged in successfully',
          _id: user._id,
          name: user.name,
          email: user.email,
          isProfileFinished: user.isProfileFinished,
          photo: user.photo,
          token,
        });
      } else {
        res.status(402).json({ message: "User is blocked by admin" });
      }
    } else {
      res.status(401).json({ message: "invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};


export const finishProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { countryId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Photo required' });
    }

    cloudinary.uploader.upload_stream(
      {
        upload_preset: 'linguaBlend',
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Upload failed', error });
        }
        const url = result?.secure_url;
        try {
          await User.findByIdAndUpdate(
            { _id: userId },
            {
              countryId,
              photo: url,
              isProfileFinished: true,
            }
          );
          res.status(200).json({
            status: 'success',
            message: 'Profile setting finished successfully',
            photo: url,
          });
        } catch (error) {
          console.error('Database update failed:', error);
          res.status(500).json({ message: 'Profile not completed', error });
        }
      }
    ).end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Profile not completed', error });
  }
};


// export const logout = (req: Request, res: Response) => {
//   try {
//     res.status(200).json({ message: "Logged out " });
//   } catch (error) {
//     console.log(error);
//   }
// };


// export const contactAdmin=async(req:Request,res:Response)=>{
//   try{
//      const {userName,userEmail,content}=req.body
//      const newadmincontact=new ContactAdmin({
//       user_name:userName,
//       user_email:userEmail,
//       content
//      })
//      newadmincontact.save()
//      res.status(200).json({message:'contacted admin successfully'})
//   }catch(error){
//     console.log(error)
//     res.status(400).json({message:'contacting admin failed'})
//   }
// }


