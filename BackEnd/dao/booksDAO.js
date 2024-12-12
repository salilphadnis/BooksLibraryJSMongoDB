import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let books;

export default class BooksDAO {

  static async injectDB(conn) {

    //if already connected to reviews db, nothing to be done
    if (books) {
      return;
    }
    try {
      //DB name, collection name
      books = await conn.db("MyBooksLibraryDB").collection("books");
      //books = await conn.db("reviews").collection("reviews");

      console.log("I am here !!!!!!!!!!!!")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addBook(bookId, category) {
    try {
      //build key-value pairs
      const bookDoc = {
        bookId: bookId,
        category: category,
      };

      //console.log(bookDoc);

      //insert into DB, await till done
      //inertOne is a MongoDB command
      return await books.insertOne(bookDoc);
    } catch (e) {
        console.error(`Unable to post book: ${e}`);
        return {error: e};
    }
  }

}
