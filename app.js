const express = require("express");
const app = express();
const apiRouter = require('./routes/api');
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname, 'public')));

require("dotenv").config({
    path: path.resolve(__dirname, ".env"),
});
const { MongoClient, ServerApiVersion } = require("mongodb");



//Initializing app parameters
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));


const databaseName = "FootballTeams";
const collectionName = "teams";
const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

app.get("/", (request, response) => {
  response.render('home');
});

app.get("/makeTeam", (request, response) => {
  response.render('makeTeam');
}); 

app.get("/viewTeam", (request, response) => {
  response.render('viewTeam');
});

app.get("/getInfo", (request, response) => {
  response.render('getInfo', { result: null, error: null });
});


app.post("/makeTeam", async (request, response) => {
  const {name, QB, RB, WR1, WR2, TE} = request.body;
  try {
      await client.connect();
      const database = client.db(databaseName);
      const collection = database.collection(collectionName);

      /* Inserting one team */
      const team = 
          {name: name, QB: QB, RB: RB, WR1: WR1, WR2: WR2, TE: TE};

      await collection.insertOne(team);
  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
  response.render('makeTeamConfirm', {name, QB, RB, WR1, WR2, TE});
}); 


app.post("/viewTeam", async (request,response) => {
  const {name} = request.body;

  let result;
  try {
      await client.connect();
      const database = client.db(databaseName);
      const collection = database.collection(collectionName);

      let filter = { name:  name};
      result = await collection.findOne(filter);
  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }

  if (result) {
      const name = result.name;
      const QB = result.QB;
      const RB = result.RB;
      const WR1 = result.WR1;
      const WR2 = result.WR2;
      const TE = result.TE;
      response.render("viewTeamConfirm", {name, QB, RB, WR1, WR2, TE});
  } else{
      const name = "NONE";
      const QB = "NONE";
      const RB = "NONE";
      const WR1 = "NONE";
      const WR2 = "NONE";
      const TE = "NONE";
      response.render("viewTeamConfirm", {name, QB, RB, WR1, WR2, TE});
  }
});

app.use('/', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));