const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
const items = ["Ride Bike", "Water the plants", "Do Rubix Cube"];
const workItems = [];
//app that's generated using express to use ejs as a view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Welcome to your todolist2!"
});

const item3 = new Item({
    name: "Welcome to your todolist3!"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully inserted!");
    }
})

// default route
app.get("/", function (req, res) {

    res.render('list', {
        listTitle: "Today",
        newListItems: items
    })
});

app.post("/", function (req, res) {

    let item = req.body.newItem;
    console.log(req.body);

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }


})

app.get("/work", function (req, res) {
    res.render('list', {
        listTitle: "Work List",
        newListItems: workItems
    })
})

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.get("/about", function (req, res) {
    res.render("about");
})
app.listen(3000, function () {
    console.log("Server started on port 3000.");
});