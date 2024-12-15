import express from "express";
import BooksCtrl from "./books.controller.js"

//Create router
//When people go to urls, this will route the the request to different parts of the application
const router = express.Router();

//Test route
//router.route("/").get((req, res) => res.send("hello world"));

//Base route of the app
//Route GET request of movies/:id to apiGetReviews
//router.route("/movie/:id").get(BooksCtrl.apiGetBooks);

//Route POST request on /new url to apiPostReview
router.route("/new").post(BooksCtrl.apiPostBook);

router.route("/library").get(BooksCtrl.apiGetBooks);

//route GET, PUT and DELETE requests recieved on /:id url to the corresponding API
router.route("/library/:id")
  .delete(BooksCtrl.apiDeleteBook)

//  .get(ReviewsCtrl.apiGetReview)
//  .put(ReviewsCtrl.apiUpdateReview)

export default router;
