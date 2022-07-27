import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    Name: String,
    FullName: String,
    Address: String,
    PhoneNumber: String,
    Email_Id: String,
})

export default mongoose.model("UserDetails",UserSchema)

