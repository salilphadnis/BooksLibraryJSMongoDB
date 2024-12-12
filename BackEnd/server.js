import express from "express";
import cors from "cors";

//import routes
import books from "./api/books.route.js";

//load express to create web server
const app = express();

//Use middleware
app.use(cors());

//This will allow the server to accept json in the body of the request
app.use(express.json());

//Specify routes (URL to send and receive info)
//For the url /api/v1/reviews, use the route reviews from reviews.route.js
app.use("/api/v1/books", books);

//URL that is not included, if anyone goes to any other routes
app.use("*", (req, res) => res.status(404).json({error: "not found"}));

//export app as a module
export default app;



