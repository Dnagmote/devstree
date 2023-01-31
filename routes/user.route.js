const mongoose = require("mongoose");
const router = require("express").Router();


let jwt = require("jsonwebtoken");
const secreteKey ={jwt_secreteKey:"secreteKey"};

let auth = require("../helper/auth.js")
let multer = require("multer");
const fs = require ("fs");
const path = require("path");
const upload = require("../upload/uploadImages.js");
let staticFilesUrl = "http://localhost:3000/"




require ("../models/user.model.js")
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
let saltRounds = 10;
const { validationResult } = require('express-validator');
const validator = require("../helper/validator.js")


router.post("/register", validator.registration(), async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userData = await User.findOne({
        email: req.body.email
      })
      if (userData) {
        res.status(201).json({
        status : "SUCCESS",
        message :"User already registerd",
        })
      } else {
        let data = req.body;
        bcrypt.genSalt(saltRounds, async function (err, salt) {
          bcrypt.hash(data.password, salt, async function (err, hash) {
            data["password"] = hash;
            var user = await new User(data).save();
            if (user) {

                res.status(201).json({
                    status : "SUCCESS",
                    message :"User registerd successfully",
                    data : user
                    })
            } else {
                res.status(301).json({
                    status : "FAILURE",
                    message :"Something went wrong",
                    })
            }
          })
        });
      }
    } catch (error) {
      console.log(error)
      res.status(301).json({
        status : "FAILURE",
        message :"Something went wrong",
        })
    }
  });

  router.post("/login",  validator.login(), async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      let findUser = await User.findOne({ email: email });
  
      if (!findUser) {
        res.status(400).json({
            status : "FAILURE",
            message :"email not found",
            })
      } else {
        findUser = JSON.parse(JSON.stringify(findUser));
        let matchPasword = await bcrypt.compare(password, findUser.password);
        if (matchPasword) {
          let token = await jwt.sign(findUser, secreteKey.jwt_secreteKey, {
            expiresIn: "24h",
          });
          findUser["token"] = `Bearer ${token}`;
          res.status(200).json({
            status : "SUCCESS",
            message :"User login successfully",
            data : findUser
            })
        } else {
            res.status(400).json({
                status : "FAILURE",
                message :"email or password is incorrect",
                })
            }
        
      }
    } catch (error) {
      console.log(error);
      res.status(301).json({
        status : "FAILURE",
        message :"Something went wrong",
        })
    }
  });
  


  router.get("/get/profile", auth.verifyToken, async (req, res) => {
    try {
      let userId = req.userId;
      console.log("===============",req.userId)
      let userData = await User.findOne({ _id: userId }).select("-password -createdAt -updatedAt -__v");

      res.status(200).json({
        status : "SUCCESS",
        message :"User data retrived successfully",
        data : userData
        })
    } catch (error) {
      console.log(error);
      res.status(301).json({
        status : "FAILURE",
        message :"Something went wrong",
        })
    }
  })

  router.get("/getAll/users", auth.verifyToken, async (req, res) => {
    try {
      let { search } = req.query;
      let result;
      if (search && search != "") {
        result = await User.find({ fullName: { $regex: search, $options: "i" } })
      }else{
        result = await User.find();
      }
      if (result.length != 0) 
      { res.status(200).json({
        status : "SUCCESS",
        message :"User data retrived successfully",
        data : result
        })
      } else {

        res.status(200).json({
          status : "FAILURE",
          message :"Not Found",
          })
      }
    } catch (error) {
      console.log(error);
      res.status(301).json({
        status : "FAILURE",
        message :"Something went wrong",
        })
    }
  })

  router.post("/upload/user/profile_pic", (req, res) => {
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public')
    } 
    else {
      if (!fs.existsSync('./public')) {
        fs.mkdirSync('./public')
      }
    }
    upload.uploadImage(req, res, (err) => {
      var files = [];
      req.files.forEach((ele) => {
        files.push(staticFilesUrl + ele.filename);
      });

      res.status(200).json({
        status : "SUCCESS",
       data :files
        })
    });
  });


  module.exports = router;