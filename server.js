const express = require ("express");
const app = express();
const fs = require ("fs");
const path = require ("path");

const mongoose = require ("mongoose");
const db = require ("./db/conn.js");

app.use(express.json());
const PORT = 3000;

function enableStaticFileServer(expressInstance, folderName, route) {
    app.use(route, express.static(path.join(__dirname, folderName)));
  }
  
  enableStaticFileServer(app, "public", "/");

require ("./routes/index.route.js")(app);


app.listen(PORT, ()=>{
console.log (`Server is running at port ${PORT}`);
})

