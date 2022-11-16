const mongoose = require("mongoose");
const { english, spanish } = require("./seedHelperEngSpan");
// const hints = require("./hints");
const { hintOne, hintTwo } = require("./hints");
const cities = require("./cities");
const Viewall = require("../models/viewAll");
const Travelall = require("../models/viewAllTravel");

mongoose.connect("mongodb://localhost:27017/Spanish", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB Connexed");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDbSpan = async () => {
    await Viewall.deleteMany({});
    await Travelall.deleteMany({});
    for (let i = 0; i < 12; i++) {
        const randomOnes = Math.floor(Math.random() * 1000);
        const idioma = new Viewall({
            card: `${sample(english)} ${sample(spanish)}`,
            hint: `${sample(hintOne)} ${sample(hintTwo)}`,
            location: `${cities[randomOnes].city}, ${cities[randomOnes].state}`,
            image: "https://source.unsplash.com/collection/483251",
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        });
        await idioma.save();

        const idiomaToo = new Travelall({
            location: `${cities[randomOnes].city}, ${cities[randomOnes].state}`,
            image: "https://source.unsplash.com/collection/483251",
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        });
        await idiomaToo.save();
    }
};

seedDbSpan().then(() => {
    mongoose.connection.close();
});
