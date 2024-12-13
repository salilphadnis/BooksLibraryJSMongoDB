///////////////////////////////////////////////////////////////////////////////
  
const BOOKSURL = "https://www.googleapis.com/books/v1/volumes?";
const BOOKSAPILINK = "https://www.googleapis.com/books/v1/volumes?q=Broca+inauthor:sagan+intitle:cosmos";

//BASE API for saving adding book to library
const BACKEND_APILINK = 'http://localhost:8080/api/v1/books/';


const bookQuery = document.getElementById('inputBookQuery');
let booksList = document.getElementById('booksList');

//Extract ISBN 13 from the indsutryIdentifiers array 
function getISBN13(industryIdentArray) {
  let isbn13 = "ISBN13 Not found";
  //Extract ISBN_13
  //ISBN array is inside volumeInfo.industryIdentifies
  industryIdentArray.forEach(identElement => {
    //console.log(identElement.identifier);
    if (identElement.type === "ISBN_13") {
      isbn13 = identElement.identifier;
    }    
  });
  return isbn13;
}

//Add a book to MongoDB by sending a POST request
function addBookToLibrary(bookId) {

  console.log(`Adding bookId ${bookId} to DB`);
  fetch(BACKEND_APILINK + "new", {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"bookId": bookId})    
  }).then(response => response.json())
    .then(response => {
      console.log(response);
      //location.reload();
    })
}

//Get books and display in a list
btnGetBooks.addEventListener('click', () => {
  const book = inputBook.value;
  const author = inputAuthor.value;
  const title = inputTitle.value;

  const booksAPIURL = BOOKSURL + `q=${book}+inauthor:${author}+intitle:${title}`;
  //console.log(data.items);
  console.log(booksAPIURL);

  let imageURL;
  let skipThisBook = false;

  //Get the book from Google books and display book title and thumbnail on page
  fetch(booksAPIURL).then(response => response.json())
    .then((data) => {        

      if (data.items) {
        //Start the list
        booksList.innerHTML = '';

        data.items.forEach(element => {
          skipThisBook = false;
          try {
          imageURL = element.volumeInfo.imageLinks.thumbnail;
          } catch (err) {
            skipThisBook = true;
          }

          const title = element.volumeInfo.title;
          const bookId = element.id;
          //Get ISB13 from the industry identifiers array
          const isbn13 = getISBN13(element.volumeInfo.industryIdentifiers);
        
          //Skip book if no thumbnail exists
          if (!skipThisBook) {
            booksList.innerHTML += `<div class="book">
                                      <img src="${imageURL}">
                                      <p class="book-title">${title}</p>
                                      <p class="isbn13">${isbn13}</p>
                                      <p>${bookId}<p>
                                      <a href="#" onclick="addBookToLibrary('${bookId}')">Add to Library</a>
                                    </div>`;

            //console.log(booksList.innerHTML);
            
          }

        });

        //End the list
      } else {
        booksList.innerHTML = 'No books found';
      }

    });
});


