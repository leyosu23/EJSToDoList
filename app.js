const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const workItems = [];
//app that's generated using express to use ejs as a view engine
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:test123@cluster0.a4pvx.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Welcome to your todolist2!",
});

const item3 = new Item({
  name: "Welcome to your todolist3!",
});

const defaultItems = [item1, item2, item3];

// default route
app.get("/", function (req, res) {
  Item.find({}, function (err, item) {
    if (item.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: item,
      });
    }
  });
});

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/:custListName", function (req, res) {
  const custListName = _.capitalize(req.params.custListName);
  List.findOne(
    {
      name: custListName,
    },
    function (err, foundList) {
      if (!err) {
        if (!foundList) {
          // if the list doesn't exist then add a list
          const list = new List({
            name: custListName,
            items: defaultItems,
          });
          list.save();
          res.redirect("/" + custListName);
        } else {
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items,
          });
        }
      }
    }
  );
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne(
      {
        name: listName,
      },
      function (err, foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    );
  }
});

app.post("/delete", function (req, res) {
  const checkItemId = req.body.checkBox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully removed");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems,
  });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port ==null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully.");
});
