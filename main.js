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
photoGallery.addEventListener('focusout', saveChanges);
photoGallery.addEventListener('click', clickHandler);
searchInput.addEventListener('input', searchPhotos);
photoGallery.addEventListener('keydown', saveOnReturn);

function clickHandler(e) {
  if(e.target.id === 'delete') {
    deletePhoto(e);
  }
  else if(e.target.id === 'favorite') {
    addFavorite(e);
  }
}

//Functions//
function appendPhotos(array) {
  imagesArr = [];
  array.forEach(function (photo) {
    var newPhoto = new Photo(photo.title, photo.caption, photo.id, photo.file);
    imagesArr.push(newPhoto);
    displayPhoto(newPhoto);
  });
  clearPhotoFields();
}

function loadImg(e) {
  e.preventDefault();
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
      `<article class="photo-box" data-id="${photoObj.id}">
          <h3 class="photo-box-title" contenteditable="true" maxlength="115">${photoObj.title}</h3>
          <img id="photo" src=${photoObj.file} />
          <h3 class="photo-box-caption" contenteditable="true" maxlength="115">${photoObj.caption}</h4>
        <div class="btn-section">
          <input type="image" src="images/delete.svg" class="card-buttons" id="delete" alt="Delete">
          <input type="image" src="images/delete-active.svg" class="card-buttons" id="delete-active" alt="Delete">
          <input type="image" src="images/favorite.svg" class="card-buttons" id="favorite" alt="Favorite">
        </div>
      </article>`
    photoGallery.insertAdjacentHTML('afterbegin', photoCard);
}

function clearPhotoFields(){
  title.value = '';
  caption.value = '';
}

function saveOnReturn(e){
  if (event.keyCode === 13){
    e.preventDefault();
    saveChanges(e);
    e.target.blur();
  }
}

function saveChanges(e){
  var card = e.target.closest('.photo-box');
  var cardId = parseInt(card.dataset.id);
  var photoTitle = card.firstChild.nextSibling;
  var editTitle = photoTitle.innerText;
  var photoCaption = card.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
  var editCaption = photoCaption.innerText;
  var neededPhoto = findPhoto(cardId);
  neededPhoto.updatePhoto(editTitle, editCaption);
}

function deletePhoto(e) {
  var card = e.target.closest('.photo-box');
  var cardId = parseInt(card.dataset.id);
  card.remove();
  var neededPhoto = findPhoto(cardId);
  neededPhoto.deleteFromStorage();
}

function findPhoto(cardId) {
  return imagesArr.find(function(photo) {
    return photo.id === cardId;
  });
}

function addFavorite(e){
  var card = e.target.closest('.photo-box');
  var cardId = parseInt(card.dataset.id);
  photo.favorite = true;
  console.log(photo);
  //change favorite image to active(add/remove in CSS);
  //quality counter
  //updates innerText to favorite button
  //
}

function removePhotos() {
  photoGallery.innerHTML = '';
} 

function searchPhotos(){
  removePhotos();
  var newSearch = searchInput.value;
  var searchValue = newSearch.toLowerCase();
  var searchPhotos = imagesArr.filter(function(photo){
    return photo.title.toLowerCase().includes(searchValue) || photo.caption.toLowerCase().includes(searchValue);
  });
  searchPhotos.forEach(function(element) {
    displayPhoto(element);
  });
}

function clearSearchField(){
  searchInput.value = '';
}

