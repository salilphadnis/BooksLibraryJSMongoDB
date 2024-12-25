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

  static async addBook(bookId, category, title, thumbnail) {
    try {
      //build key-value pairs
      const bookDoc = {
        bookId: bookId,
        category: category,
        title: title,
        thumbnail: thumbnail,
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

  static async getBooks() {
    try {
      return await books.find().sort({"title":1}).toArray();
    } 
    catch (e) {
      console.error(`Unable to get books: ${e}`);
      return {error: e};
    }
  }

  static async deleteBook(bookDBId) {

    try {
      const deleteResponse = await books.deleteOne({
        _id: new ObjectId(bookDBId),
      });
      return deleteResponse;
    }  catch (e) {
      console.error(`Unable to update book: ${e}`);
      return {error: e};
    }
  }

}
