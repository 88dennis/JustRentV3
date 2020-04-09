let express = require("express");
let bodyParser = require("body-parser");
let PORT = 3000;
let app = express();
let mongoose = require("mongoose");

// let rentalObjects = [
//     { name: "Generator Set", description: "10KVA", price: 1200, imgSource: "https://i.imgur.com/OwZkp7O.jpg" },
//     { name: "Air cooler", description: "fan coolers", price: 2500, imgSource: "https://i.imgur.com/LIBSVUF.jpg" },
//     { name: "Coring Machine", description: "Portable Coring Machine", price: 5000, imgSource: "https://i.imgur.com/Acftg1s.jpg" },


//     { name: "Industrial fan", description: "Stand Fan", price: 1900, imgSource: "https://i.imgur.com/vcqEmRW.jpg" },

//     { name: "Jack Hammer", description: "Portable Jackhammer", price: 800, imgSource: "https://i.imgur.com/SyuUX9F.jpg" },
//     { name: "Welding Machine", description: "Portable Welding Machine", price: 900, imgSource: "https://i.imgur.com/EF8eRoG.jpg" },

// ];
// console.log(rentalObjects);
// console.log(rentalObjects[0]["name"]);

//connect to the database
//if you dont have a database this will create one for you
//when you run mongoose connect this will try to find the bird_app then if it did not find it will create one
//from mongoose.com documentation
//the birdApp is the name of our database
//npm uninstall mongoose ; npm i mongoose@5.9.8 --save
mongoose.connect('mongodb://localhost:27017/justRentV3', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//SCHEMA
let justRentSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imgSource: String
});

//COMPILE THE SCHEMA INTO A MODEL
//the Arguement "Rental" will automatically give you a collection named "Rental"
//this model pluralizes the "Rental" automatically and create a collection rentals
//example: db.rentals
//making a model out of the schema so we can use the methods
let Rental = mongoose.model("Rental", justRentSchema);

// Rental.create(
//     { name: "Welding Machine", description: "Portable Welding Machine", price: 900, imgSource: "https://i.imgur.com/EF8eRoG.jpg" },
//     function(err, rental){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("added ITEMS!!!!")
//             console.log(rental);
//         }
//     }
// );

//Route for the landingPage.ejs
app.get("/", function (req, res) {
    res.render("landingPage");
});

//INDEX ROUTE
//Route for the viewRentalsPage.ejs - where the items are displayed
app.get("/forRentItems", function (req, res) {
    //GET ALL ITEMS FOR RENT FROM THE DATABASE USING MONGOOSE SYNTAX REFERRING TO THE MONGOOSE MODEL
    Rental.find({}, function (err, allRental) {
        if (err) {
            console.log(err)
        } else {
            //RENDER THE OBJECT FROM THE DATABASE
            console.log(allRental);
            res.render("viewRentalsPage", { rentalObjectsEjs: allRental })
        }
    })
});

//NEW ROUTE
//Route for the Page new.ejs - where you add new items
app.get("/forRentItems/new", function (req, res) {
    res.render("new");
});



//CREATE ROUTE
//Route for the FORM action, METHOD POST - getting the body from a FORM and redirects to the forRentItems route showing the viewRentals.ejs
app.post("/forRentItems", function (req, res) {
    //get data from form
    //rest route meaning same name as the get route
    //the form action will activate this route then send a body
    //the body is the object which will have a key pertaining to name you indicated on the form
    //the form from the landing page will send a body 
    console.log(req);
    //to view the req.body you need to install the nmp i body-parser and use it; no body parser, no req.body
    console.log(req.body);
    let newPost = req.body;

    //create an object from the req.body and pass it to the mongoose syntax
    let newObject = {
        name: newPost.name,
        description: newPost.description,
        price: Number(newPost.price),
        imgSource: newPost.imgSource
    };

    console.log("---------------------");
    console.log(newObject);
    //CREATE A NEW RENTAL ITEM using the OBJECT you got from the req.body
    Rental.create(
       newObject,
        function(err, newItem){
            if(err){
                console.log(err);
            } else {
                console.log("added ITEMS!!!!")
                console.log(newItem);
    res.redirect("/forRentItems");
            }
        }
    );

    console.log("POST ROUTE");
    //redirects you to the getroute
});


//SHOW ROUTE - PASS INFO FROM ONE EJS FILE/ PAGE TO ANOTHER
app.get("/forRentItems/:id", function(req, res){
    //from the anchor tag at viewRentals page moreinfo the route will give you the id
    console.log(req.params.id);
    let itemId = req.params.id;
    Rental.findById(itemId, function(err, itemInfo){
        if(err){
            console.log(err);
        } else {
            console.log(itemInfo);
            res.render("moreInfo", {itemInfoEjs: itemInfo});
        }
    })
});


// app.get("*", function (req, res) {
//     res.send("PAGE NOT asd");
// });

app.listen(PORT, function () {
    console.log("Connected to http://localhost:" + PORT)
});


// function thousands_separators(num)
//   {
//     var num_parts = num.toString().split(".");
//     num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return num_parts.join(".");
//   }

// console.log(thousands_separators(1000));
// console.log(thousands_separators(10000.23));
// console.log(thousands_separators(100000));


//----------------- GOOD

// var number = 987654321;
// number.toLocaleString(); // "987,654,321"
// // A more complex example: 
// var number2 = 9876.54321; // floating point example
// number2.toLocaleString(undefined, {
// 	maximumFractionDigits: 2
// }); // "9,876.54"

//----------------

// var nf = new Intl.NumberFormat();
// nf.format(number); // "1,234,567,890"    


// RESTFUL ROUTES
// (STRUCTURE/ PATTERN)
// name		url		        verb		    desc
// INDEX	/rentals	    GET		        displays all the rentals
// NEW		/rentals/new	GET		        displays the form to make a new rental item
// CREATE	/rentals	    POST		    add new rental item to DB
// SHOW      /rentals/:id    GET             shows info about one dog