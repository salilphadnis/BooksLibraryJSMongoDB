import BooksDAO from "../dao/booksDAO.js";

export default class BooksController {

  static async apiPostBook(req, res, next) {

    try {
      //This is coming from the request body 
      //We type the JSON into Postman for testing

      //bookId should be the google books Id for this book
      const bookId = req.body.bookId;
      //review is a string
      //const review = req.body.review;

      //Books category
      const category = req.body.category;

      //user is a string
      //const user = req.body.user;

      //call a method in the DAO with the above parameters
      //and wait for a respone from the DAO
      //The DAO talks to MongoDB
      const bookResponse = await BooksDAO.addBook(
        bookId, 
        category,
      )

      //Send the response back to client as JSON
      res.json({status: "success"});
    } catch {
      res.status(500).json({error: e.message});
    }

  }

}