import mongoose,{Document} from "mongoose";
import bcrypt from 'bcryptjs'


interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isBlocked: boolean;
    isProfileFinished:boolean,
    following: any[];
    followers: any[];
    countryId:any;
    photo:string;
    isGoogleLogin:boolean;
    isVerified:boolean;
    matchPasswords(enteredPassword: string): Promise<boolean>;
}

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    countryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'countries'
    },
    photo:{
        type:Object
    },
    isProfileFinished:{
       type:Boolean,
       default:false
    },
    isGoogleLogin:{
        type:Boolean,
        default:false
    },
},
{
    timestamps:true
}
)


    userSchema.pre('save',async function(next){
        if(!this.isModified('password')){
            next()
        }
        if(this.password){
            const salt=await bcrypt.genSalt(10)
            this.password=await bcrypt.hash(this.password,salt)
        }
        next()    
    })



userSchema.methods.matchPasswords=async function(enteredPassword:string){
   return await bcrypt.compare(enteredPassword,this.password)
}

export const User=mongoose.model<IUser>('users',userSchema)