
const BOOKSURL = "https://www.googleapis.com/books/v1/volumes?";
const BOOKSAPILINK = "https://www.googleapis.com/books/v1/volumes?q=Broca+inauthor:sagan+intitle:cosmos";

//BASE API for saving adding book to library
const BACKEND_APILINK = 'http://localhost:8080/api/v1/books/';


const bookQuery = document.getElementById('inputBookQuery');
const booksList = document.getElementById('booksList');
const booksNav = document.getElementById('booksNav');
const btnGetBooks = document.getElementById('btnGetBooks');
const anchorNextBooks = document.getElementById('nextSetOfBooks');

let books = [];

let index = 0;

let totalItems;

//Extract ISBN 13 from the indsutryIdentifiers array 
function getISBN13(industryIdentArray) {
  let isbn13;
  //Extract ISBN_13
  //ISBN array is inside volumeInfo.industryIdentifies
  if (industryIdentArray) {
    industryIdentArray.forEach(identElement => {
      //console.log(identElement.identifier);
        if (identElement.type === "ISBN_13") {
          isbn13 = identElement.identifier;
        }          
    });
  }
  return isbn13;
}

//Add a book to MongoDB by sending a POST request
function addBookToLibrary(bookId, title, imageURL) {

  console.log(`Adding bookId ${bookId} title ${title} ${imageURL} to DB`);
  fetch(BACKEND_APILINK + "new", {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"bookId": bookId, "title": title, "thumbnail": imageURL})    
  }).then(response => response.json())
    .then(response => {
      console.log(response);      
      location.href="./library.html";
    })
}

//Create Google Books API URL
function getSearchURL() {
  const book = document.getElementById("inputBook").value;
  const author = document.getElementById("inputAuthor").value;
  const title = document.getElementById("inputTitle").value;

  //console.log("book: ", book);

  let authorString = "";
  if (author != "") {
    authorString = `+inauthor:${author}`;
  }

  let titleString = "";
  if (title != "") {
    titleString = `+intitle:${title}`;
  }

  //URL to get books from Google books API
  const booksAPIURL = BOOKSURL + `q="${book}"` + authorString + titleString 
                      + "&maxResults=20" + `&startIndex=${index}`;
  return booksAPIURL;
}

//Display One book card 
function displayOneBook(book) {
  
  booksList.innerHTML += `<div class="book">
                            <div class="bk-img-container">
                              <img src="${book.thumbnail}" alt="No book img">
                            </div>
                            <p class="book-title">${book.title}</p>
                            <p class="isbn13">${book.isbn13}</p>
                            <a href="#" onclick="addBookToLibrary('${book.bookId}', '${book.title}', '${book.thumbnail}')">Add to Library</a>
                          </div>`;
}

//Display all the books in the page 20 at a time
function displayAllBooks(books) {

  //Start the list
  booksList.innerHTML = '';

  books.forEach(book => {
      index++;
      displayOneBook(book);
    });

    console.log(index);
    //Add Prev, Next bar below the books
    booksNav.innerHTML = `<a href="#" onclick="fetchBooksandDisplay()">Next</a>`

}

//Create an instance of book class for each item returned by google books api
//and add to books array
function addBooksToArray(data) {

  if (data.items) {
    data.items.forEach(element => {
      let imageURL = "";

      try {
        imageURL = element.volumeInfo.imageLinks.thumbnail;
      } catch (err) {
        //No image URL, leave it blank
      }

      const title = element.volumeInfo.title;
      const bookId = element.id;
      //Get ISB13 from the industry identifiers array
      let isbn13 = getISBN13(element.volumeInfo.industryIdentifiers);

      //instance of book
      const book = new Book(title, imageURL, bookId, isbn13);
      books.push(book);
    });
  }
}

//fetch books from google books api
function fetchBooksandDisplay() {
  const booksAPIURL = getSearchURL();
  console.log(booksAPIURL);
  books = [];

  //Get the book from Google books and display book title and thumbnail on page
  fetch(booksAPIURL).then(response => response.json())
    .then((data) => {        

      totalItems = data.totalItems;
      
      addBooksToArray(data); //Create array of book instances
      //console.log(books);
      displayAllBooks(books);
    });

}

//When user clicks "Get Books", button fetch the books and display
btnGetBooks.addEventListener('click', () => {
  console.log("here");
  index = 0;
  fetchBooksandDisplay(); 
});
