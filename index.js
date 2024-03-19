import bodyParser from "body-parser";
import express from "express";
import axios from "axios";
import { heroQoutes } from "./parse.js"

const app = express();
const port = 3000;

const response = await axios.get(`https://api.opendota.com/api/heroStats`);
const heroStats = response.data;

function selectedHeroQoute (selectedHero) {
	let randomNumber = Math.floor(Math.random() * 5)
	let randomQoute = heroQoutes.heroes.find(hero => hero.name.toLocaleLowerCase() === selectedHero.toLocaleLowerCase())["quotes"][randomNumber]
	console.log(randomQoute)
  return randomQoute
}


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true }));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => { 
  try {

    let heroName = req.body.heroName;

    heroName = heroName.replace(" ", "_");

    const selectedHeroStats = heroStats.find(hero => hero.localized_name.toLowerCase() === heroName.toLowerCase().replace("_", " "));
    
    console.log("Name: " + heroName);
    console.log(selectedHeroStats);

    let statOutput = [];

    selectedHeroQoute(heroName.replace("_", " "))

    statOutput.push({
      primaryStat: selectedHeroStats["primary_attr"], 
      attackType: selectedHeroStats["attack_type"],
      roles: selectedHeroStats["roles"], 
      baseHealth: selectedHeroStats["base_health"],
      baseMana: selectedHeroStats["base_mana"],
      baseStr: selectedHeroStats["base_str"],
      baseAgi: selectedHeroStats["base_agi"],
      baseInt: selectedHeroStats["base_int"],
      moveSpeed: selectedHeroStats["move_speed"],
    });
    
    res.render("index.ejs", {
      selectedHero: heroName,
      statOutput: statOutput,
      heroQoute : selectedHeroQoute(heroName.replace("_", " "))
    });
  } catch (error) {
    const errors = "Incorrect Hero Name!";
    res.render("index.ejs", {
      error: errors
    });
  }
});


app.get("/heroes", async (req, res) => {

  
  let heroList = [];

  heroStats.forEach(hero => {
    heroList.push(hero.localized_name)
  });

  res.render("heroes.ejs", ({heroList : heroList}))
})




app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
