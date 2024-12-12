import app from "./server.js";
import BooksDAO from "./dao/booksDAO.js"

//mongodb JS library created by MongoDB
import mongodb from "mongodb";
//import ReviewsDAO from "./dao/reviewsDAO.js";

//Create client to connect to DB
const MongoClient = mongodb.MongoClient;
//const mongo_username = process.env['MONGO_USERNAME'];
//const mongo_password = process.env['MONGO_PASSWORD'];

const mongo_username = "salilaphadnis";
const mongo_password = "raveena123";

console.log("mongo_username", mongo_username);
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.ppyzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//const uri = `mongodb+srv://salilaphadnis:raveena123@cluster0.so9ca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


const port = 8080;

//Connect to Mongo client
//return the client
MongoClient.connect(
  uri,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await BooksDAO.injectDB(client); //send DB connection to DAO 
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });    
  });
