const mongoose = require("mongoose");


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/Devstree")
.then(()=>{
    console.log("Database connected succsessfully")
})
 .catch ((error)=>{
    console.log(`"Unable to connect database", ERROR : ${error}`)
});