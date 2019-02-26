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
var showBtn = document.querySelector('.show-more-btn');

//Event Listeners//
window.addEventListener('load', appendPhotos(imagesArr));
addToAlbum.addEventListener('click', loadImg);
photoGallery.addEventListener('focusout', saveChanges);
photoGallery.addEventListener('click', clickHandler);
searchInput.addEventListener('input', searchPhotos);
photoGallery.addEventListener('keydown', saveOnReturn);
showBtn.addEventListener('click', showPhotos);

function clickHandler(e) {
  if(e.target.id === 'delete') {
    deletePhoto(e);
  }
  if(e.target.id === 'favorite') {
    var targetCard = findPhoto(e);
    e.target.dataset.favorite = !JSON.parse(e.target.dataset.favorite);
    targetCard.favorite = !targetCard.favorite;
    targetCard.favorite ? increaseFavCounter() : decreaseFavCounter();
    targetCard.favorite ? activateFavorite(e.target) : deactivateFavorite(e.target);
    targetCard.saveToStorage(imagesArr);
  }
}
//Functions//
function appendPhotos(array) {
  imagesArr = [];
  array.forEach(function (photo) {
    var newPhoto = new Photo(photo.title, photo.caption, photo.id, photo.file, photo.favorite);
    imagesArr.push(newPhoto);
    displayPhoto(newPhoto);
  });
  hidePhotos();
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
  clearPhotoFields();
}

function displayPhoto(photoObj) {
    var photoCard =  
      `<article class="photo-box" data-id="${photoObj.id}">
          <h3 class="photo-box-title" contenteditable="true" maxlength="115">${photoObj.title}</h3>
          <img id="photo" src=${photoObj.file} />
          <h3 class="photo-box-caption" contenteditable="true" maxlength="115">${photoObj.caption}</h4>
        <div class="btn-section">
            <input type="image" src="images/delete.svg" class="card-buttons" id="delete" alt="Delete">
            <input type="image" src="images/favorite.svg" data-favorite="${photoObj.favorite}" class="card-buttons" id="favorite" alt="Favorite">
        </div>
      </article>`
    photoGallery.insertAdjacentHTML('afterbegin', photoCard);
    var msgBtn = document.querySelector('.add-photo');
    msgBtn.classList.add('add-photo');
    displayShowButton();
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

function saveChanges(e) {
  if (e.target.className === 'photo-box-title' || e.target.className === 'photo-box-caption') {
    var card = e.target.closest('.photo-box');
    var cardId = parseInt(card.dataset.id);
    var photoTitle = card.querySelector('.photo-box-title');
    var editTitle = photoTitle.innerText;
    var photoCaption = card.querySelector('.photo-box-caption');
    var editCaption = photoCaption.innerText;
    var neededPhoto = findPhoto(e);
    neededPhoto.updatePhoto(editTitle, editCaption);
  }
}

function deletePhoto(e) {
  var card = e.target.closest('.photo-box');
  card.remove();
  var neededPhoto = findPhoto(e);
  neededPhoto.deleteFromStorage();
}

function findPhoto(e) {
  // if (!e.target.closest('.photo-box')) return;
  var card = e.target.closest('.photo-box');
  var cardId = parseInt(card.dataset.id);
  return imagesArr.find(function(photo) {
    return photo.id === cardId;
  });
}

// function addFavorite(e){
//   var card = e.target.closest('.photo-box');
//   var cardId = parseInt(card.dataset.id);
//   photo.favorite = true;
//   console.log(photo.favorite);
  //change favorite image to active(add/remove in CSS);
  //quality counter
  //updates innerText to favorite button
  //
// }

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
  hidePhotos();
}

function displayShowButton() {
 var showMore = document.getElementById('show-more');
 if (imagesArr.length >= 10) {
   showMore.classList.remove('show-more-btn');
 } else {
   showMore.classList.add('show-more-btn');
 }
}

function hidePhotos(){
  var photosOnPage = document.querySelectorAll('.photo-box');
    for (var i = 10; i < photosOnPage.length; i++) {
      photosOnPage[i].classList.add('hidden-photo');
  }
}

function showAllPhotos() {
  var photosOnPage = document.querySelectorAll('.photo-box');
    for (var i = 10; i < photosOnPage.length; i++) {
      photosOnPage[i].classList.remove('hidden-photo');
    }
}

function showPhotos() {
  var photosOnPage = document.querySelectorAll('.photo-box');
  if (showBtn.innerText === 'Show less...') {
    hidePhotos();
    showBtn.innerText = 'Show more...';
  } else if (photosOnPage.length > 10) {
    showAllPhotos();
    showBtn.innerText = 'Show less...';
  }
}

function increaseFavCounter() {
  var favCounterElement = document.querySelector('.num-favs');
  var favCount = Number(favCounterElement.innerText);
  favCount++;
  favCounterElement.innerText = favCount;
}

function decreaseFavCounter() {
  var favCounterElement = document.querySelector('.num-favs');
  var favCount = Number(favCounterElement.innerText);
  favCount--;
  favCounterElement.innerText = favCount;
}

function activateFavorite(target) {
  target.setAttribute('src', 'images/favorite-active.svg');
}

function deactivateFavorite(target) {
  target.setAttribute ('src', 'images/favorite.svg');
}

