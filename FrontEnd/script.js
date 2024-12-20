const BOOKSURL = "https://www.googleapis.com/books/v1/volumes?";
const BOOKSAPILINK = "https://www.googleapis.com/books/v1/volumes?q=Broca+inauthor:sagan+intitle:cosmos";

//BASE API for saving adding book to library
const BACKEND_APILINK = 'http://localhost:8080/api/v1/books/';


const bookQuery = document.getElementById('inputBookQuery');
const booksList = document.getElementById('booksList');
const booksNav = document.getElementById('booksNav');
const btnGetBooks = document.getElementById('btnGetBooks');
const anchorNextBooks = document.getElementById('nextSetOfBooks');


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
  const booksAPIURL = BOOKSURL + `q="${book}"` + authorString + titleString + "&maxResults=20";
  return booksAPIURL;
}

function displayOneBook(imageURL, title, isbn13, bookId) {
  
  booksList.innerHTML += `<div class="book">
                            <div class="bk-img-container">
                              <img src="${imageURL}" alt="No book img">
                            </div>
                            <p class="book-title">${title}</p>
                            <p class="isbn13">${isbn13}</p>
                            <a href="#" onclick="addBookToLibrary('${bookId}', '${title}', '${imageURL}')">Add to Library</a>
                          </div>`;
}

function displayAllBooks(data, index) {

  let imageURL;
  let skipThisBook = false;

  if (data.items) {
    //Start the list
    booksList.innerHTML = '';

    //Display all books in the html
    data.items.forEach(element => {
      skipThisBook = false;
      index++;
      try {
        imageURL = element.volumeInfo.imageLinks.thumbnail;
      } catch (err) {
          //Don't print this book if there is no image URL
          //skipThisBook = true;
      }

      const title = element.volumeInfo.title;
      const bookId = element.id;
      //Get ISB13 from the industry identifiers array
      let isbn13 = getISBN13(element.volumeInfo.industryIdentifiers);
      
      if (!isbn13) {
        isbn13 = "No ISBN found";
      }

      //Skip book if no thumbnail exists
      if (!skipThisBook) {
        displayOneBook(imageURL, title, isbn13, bookId);        
      }

    });

    console.log(index);
    //Add Prev, Next bar below the books
    booksNav.innerHTML = `<a href="#" onclick="getNextSetOfBooks()">Next</a>`

    //End the list
  } else {
    booksList.innerHTML = 'No books found';
  }
}

//Get books and display in a list
btnGetBooks.addEventListener('click', () => {

  const booksAPIURL = getSearchURL();
  console.log(booksAPIURL);

  //Get the book from Google books and display book title and thumbnail on page
  fetch(booksAPIURL).then(response => response.json())
    .then((data) => {        

      totalItems = data.totalItems;
      let index = 0;
  
      displayAllBooks(data, index);
    });
});


function getNextSetOfBooks() {
  console.log("here");
  location.href = "./hello.html";
}