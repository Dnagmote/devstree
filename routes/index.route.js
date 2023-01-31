
module.exports = (app)=>{
    let userRoute = require("./user.route.js");

    app.use("/api/user", userRoute);
}