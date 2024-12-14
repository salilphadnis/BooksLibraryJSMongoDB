
const APILINK = 'http://localhost:8080/api/v1/books/library/';

//call Backend API to get all books from library
function getBooksFromLibrary(url) {
  fetch(url).then(res => res.json())
  .then(function(data) {
    console.log(data);

    console.log("I am outside if block");
    if (data) {
      console.log("I am in if block");
      booksList.innerHTML = '';

    //Add the books to the page
        data.forEach(element => {
          skipThisBook = false;
          try {
          imageURL = element.thumbnail;
          } catch (err) {
            skipThisBook = true;
          }

          if (imageURL == null) {
            skipThisBook = true;
          }

          console.log("skip is ", skipThisBook);
          const title = element.title;

          //Skip book if no thumbnail exists
          if (!skipThisBook) {
            booksList.innerHTML += `<div class="book">
                                      <img src="${imageURL}">
                                      <p class="book-title">${title}</p>
                                    </div>`;

            //console.log(booksList.innerHTML);
            
          }
        });
      }
    });
  }

//Get books from libary when the page finishes loading
window.addEventListener("load", () => {
  //Get all the books when this page is loaded
  getBooksFromLibrary(APILINK);
});