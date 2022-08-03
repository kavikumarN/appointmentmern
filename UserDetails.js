import mongoose from "mongoose";


var UserSchema = mongoose.Schema({
    // Sid: { type : String , unique : false, required : false },
    Name: { type : String , unique : false, required : true },
    Phone: { type : String , unique : true, required : true },
    Email: { type : String , unique : false, required : false },
    Time: { type : String , unique : false, required : true },
    Notes: { type : String , unique : false, required : false },
    Cr_at: { type : String , unique : false, required : true },
});

// UserSchema.pre('save', function(next) {
//     var doc = this;
//     counter.findByIdAndUpdate({_id: 'Entity_id'}, {$inc: { seq: -1} }, function(error, counter)   {
//         if(error)
//             return next(error);
//         doc.testvalue = counter.seq;
//         next();
//     });
// });
 export default mongoose.model("UserDetails",UserSchema)
