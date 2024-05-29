import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    id : {
        type : Number,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    description : {
        type : String,
        require : true,
    },
    category : {
        type : String,
        require : true,
    },
    image : {
        type : String,
    },
    solid : {
        type : Boolean,
        default : false,
    },
    dateOfSale : {
        type : Date,
    }
})
export default mongoose.model("transaction", transactionSchema)