
const APILINK = 'http://localhost:8080/api/v1/books/library/';

//call Backend API to get all books from library
function getBooksFromLibrary(url) {
  fetch(url).then(res => res.json())
  .then(function(data) {
    console.log(data);

    if (data) {
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

          //console.log("skip is ", skipThisBook);
          const title = element.title;
          const bookDBId = element._id;

          //Skip book if no thumbnail exists
          if (!skipThisBook) {
            booksList.innerHTML += `<div class="book">
                                      <img src="${imageURL}">
                                      <p class="book-title">${title}</p>
                                      <a href="#" onclick="delFromLibrary('${bookDBId}')">Delete from Library</a>
                                    </div>`;

            //console.log(booksList.innerHTML);
            
          }
        });
      }
    });
  }

function delFromLibrary(id) {
  console.log("In delFromLibrary", id);
  fetch(APILINK + id, {
    method: 'DELETE'
  }).then(res => res.json())
    .then(res => {
      console.log(res)
      location.reload();
    });    
}
  
//Get books from libary when the page finishes loading
window.addEventListener("load", () => {
  //Get all the books when this page is loaded
  getBooksFromLibrary(APILINK);
});