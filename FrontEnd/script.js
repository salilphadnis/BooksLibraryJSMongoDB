///////////////////////////////////////////////////////////////////////////////
  
const BOOKSURL = "https://www.googleapis.com/books/v1/volumes?";
const BOOKSAPILINK = "https://www.googleapis.com/books/v1/volumes?q=Broca+inauthor:sagan+intitle:cosmos";

const bookQuery = document.getElementById('inputBookQuery');
let booksList = document.getElementById('booksList');

//Extract ISBN 13 from the indsutryIdentifiers array 
function getISBN13(industryIdentArray) {
  let isbn13 = "Not found";
  //Extract ISBN_13
  //ISBN array is inside volumeInfo.industryIdentifies
  industryIdentArray.forEach(identElement => {
    console.log(identElement.identifier);
    if (identElement.type === "ISBN_13") {
      isbn13 = identElement.identifier;
    }    
  });
  return isbn13;
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
      data.items.forEach(element => {
        console.log(element.volumeInfo.title);
        skipThisBook = false;
        try {
         imageURL = element.volumeInfo.imageLinks.thumbnail;
        } catch (err) {
          skipThisBook = true;
        }

        //Get ISB13 from the industry identifiers array
        let isbn13 = getISBN13(element.volumeInfo.industryIdentifiers);
      
        //Skip book if no thumbnail exists
        if (!skipThisBook) {
          booksList.innerHTML += `<li>${element.volumeInfo.title}</li>
                                  <li><img src="${imageURL}"</li>
                                  <li>ISBN13: ${isbn13}</li>`;
          
        }

      });
    });
});


