const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = ["Ride Bike", "Water the plants", "Do Rubix Cube"];
//app that's generated using express to use ejs as a view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))

app.get("/", function (req, res) {
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    // tell javascript to set the dateString
    var day = today.toLocaleDateString("en-US", options);

    res.render('list', {
        kindOfDay: day,
        newListItems: items
    })
});

app.post("/", function (req, res) {
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server started on port 3000.");
});