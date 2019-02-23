//Global Variables//
var searchInput = document.querySelector('.search');
var searchBtn = document.querySelector('#search-btn');
var title = document.querySelector('#title-input');
var caption = document.querySelector('#caption-input');
var favorite = document.querySelector('#view-favorite');
var addToAlbum = document. querySelector('#add-to-album');
var photoGallery = document.querySelector('.photos');
var imagesArr = JSON.parse(localStorage.getItem('stringedPhotos')) || [];
var create = document.querySelector('button');
var photoInput = document.querySelector('.choose-file-btn');
var reader = new FileReader();

//Event Listeners//
window.addEventListener('load', appendPhotos(imagesArr));
addToAlbum.addEventListener('click', loadImg);

//Functions//
function appendPhotos(array) {
  imagesArr = [];
  array.forEach(function (photo) {
    var newPhoto = new Photo(photo.title, photo.caption, photo.id, photo.file);
    imagesArr.push(newPhoto);
    displayPhoto(newPhoto);
  });
}

function loadImg(e) {
  e.preventDefault();
  // console.log(photoInput.files[0])
  if (photoInput.files[0]) {
    reader.readAsDataURL(photoInput.files[0]); 
    reader.onload = addPhoto;
  }
}

function addPhoto(e) {
  var newPhoto = new Photo(title.value, caption.value, Date.now(), e.target.result);
  imagesArr.push(newPhoto);
  displayPhoto(newPhoto);
  newPhoto.saveToStorage(imagesArr);
}

function displayPhoto(photoObj) {
    var photoCard =  
      `<article class="idea-box" data-id="${photoObj.id}">
          <h3 class="idea-box-title" contenteditable="true">${photoObj.title}</h3>
          <img src=${photoObj.file} />
          <h3 class="idea-box-body" contenteditable="true">${photoObj.caption}</h4>
        <div class="btn-section">
          <input type="image" src="images/delete.svg" class="buttons" id="delete" alt="Delete">
          <input type="image" src="images/favorite.svg" class="buttons" id="favorite" alt="Favorite">
        </div>
      </article>`
    photoGallery.insertAdjacentHTML('afterbegin', photoCard);
}