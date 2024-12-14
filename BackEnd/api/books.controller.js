import BooksDAO from "../dao/booksDAO.js";

export default class BooksController {

  static async apiPostBook(req, res, next) {

    console.log("In apiPostBook ############");
    try {
      //This is coming from the request body 
      //We type the JSON into Postman for testing

      console.log("body: ", req.body);
      //bookId should be the google books Id for this book
      const bookId = req.body.bookId;

      const title = req.body.title;
      console.log("title is ", title);

      //Books category
      const category = req.body.category;

      //call a method in the DAO with the above parameters
      //and wait for a respone from the DAO
      //The DAO talks to MongoDB
      const bookResponse = await BooksDAO.addBook(
        bookId, 
        category,
        title
      )

      //Send the response back to client as JSON
      res.json({status: "success"});
    } catch {
      res.status(500).json({error: e.message});
    }

  }

}