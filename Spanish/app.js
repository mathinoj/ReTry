const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Viewall = require("./models/viewAll");
const Travelall = require("./models/viewAllTravel");

mongoose.connect("mongodb://localhost:27017/Spanish", {});

const db = mongoose.connection;

//this logic checks to see if there is an error
db.on("error", console.error.bind(console, "connect error:"));
db.once("open", () => {
    console.log("Database Connected Mayngz");
});
//this logic checks to see if there is an error^^^^^^^

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
//for the new card submission we wont see any of our text submissions because the request body hasn't been parced so we tell express to parse the body by doing the app.use...
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    // res.send("hello cards");

    res.render("home");
});

app.get(
    "/cards",
    catchAsync(async (req, res) => {
        const viewAllCamp = await Viewall.find({});
        res.render("cards/index", { viewAllCamp });
    })
);

///TRAVEL
app.get(
    "/travel",
    catchAsync(async (req, res) => {
        const viewAllTravel = await Travelall.find({});
        res.render("travel/index", { viewAllTravel });
    })
);

app.get("/cards/new", (req, res) => {
    // const card = new Viewall({ english: "What", spanish: "Que" });
    // await card.save();
    res.render("cards/new");
    //BEFORE, THIS ROUTE WAS BELOW '/cards/:id/' but we moved it here because order matters
});

///TRAVEL
app.get("/travel/new", (req, res) => {
    res.render("travel/new");
});

app.post(
    "/cards",
    catchAsync(async (req, res, next) => {
        if (!req.body.card) throw new ExpressError("Invalid card data!", 400);
        const newCard = new Viewall(req.body.card);
        // const newCardHint = new Viewall(req.body.hint);
        await newCard.save();
        // await newCardHint.save();
        res.redirect(`/cards/${newCard._id}`);
        // res.send(req.body);
    })
);

///TRAVEL
app.post(
    "/travel",
    catchAsync(async (req, res, next) => {
        if (!req.body.travel)
            throw new ExpressError("Invalid travel data!", 400);
        const newTravel = new Travelall(req.body.travel);
        await newTravel.save();
        res.redirect(`/travel/${newTravel._id}`);
    })
);
//if there is an error we will catch it with catchAsync and pass it onto next(), which is under app.use((err, req, res, next))

app.get(
    "/cards/:id",
    catchAsync(async (req, res) => {
        const viewCampId = await Viewall.findById(req.params.id);
        res.render("cards/show", { viewCampId });
    })
);

///TRAVEL
app.get(
    "/travel/:id",
    catchAsync(async (req, res) => {
        const viewTravelId = await Travelall.findById(req.params.id);
        res.render("travel/show", { viewTravelId });
    })
);

app.get(
    "/cards/:id/edit",
    catchAsync(async (req, res) => {
        const editCard = await Viewall.findById(req.params.id);
        res.render("cards/edit", { editCard });
    })
);

///TRAVEL
app.get(
    "/travel/:id/edit",
    catchAsync(async (req, res) => {
        const editTravel = await Travelall.findById(req.params.id);
        res.render("travel/edit", { editTravel });
    })
);

app.put(
    "/cards/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const editedCard = await Viewall.findByIdAndUpdate(id, {
            ...req.body.card,
        });
        res.redirect(`/cards/${editedCard._id}`);
        // res.send("it TWERKED");
    })
);

///TRAVEL
app.put(
    "/travel/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const editedTravel = await Travelall.findByIdAndUpdate(id, {
            ...req.body.travel,
        });
        res.redirect(`/travel/${editedTravel._id}`);
    })
);

app.delete(
    "/cards/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Viewall.findByIdAndDelete(id);
        res.redirect("/cards");
    })
);

//TRAVEL
app.delete(
    "/travel/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Travelall.findByIdAndDelete(id);
        res.redirect("/travel");
    })
);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Suntin went wrong!";
    res.status(statusCode).render("error", { err });
    // res.send("Suntin went wrong!");
});

app.listen(3000, () => {
    console.log("Connected port 3000");
});
