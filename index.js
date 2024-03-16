import bodyParser from "body-parser";
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true }));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => { 
  try {
    let heroName = req.body.heroName


    const response = await axios.get(`https://api.opendota.com/api/heroStats`);

    const heroStats = response.data
  
    heroStats.forEach(hero => {
      
    });

    // "localized_name": "Phantom Assassin",
    // chawerili saxelis mixedvit gmiris povna da mxolod misi statebis naxva

    heroName = heroName.replace(" ", "_")

    
    
    console.log(heroName);
    res.render("index.ejs", {selectedHero : heroName});
  } catch {
    console.log("errors");
  }
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
