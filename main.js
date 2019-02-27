var searchInput = document.querySelector('.search');
var searchBtn = document.querySelector('#search-btn');
var title = document.querySelector('#title-input');
var caption = document.querySelector('#caption-input');
var addToAlbum = document. querySelector('#add-to-album');
var photoGallery = document.querySelector('.photos');
var imagesArr = JSON.parse(localStorage.getItem('stringedPhotos')) || [];
var photoInput = document.querySelector('.choose-file-btn');
var reader = new FileReader();
var showBtn = document.querySelector('.show-more-btn');
var favBtn = document.querySelector('#view-favorite');

window.addEventListener('load', loadPhotos(imagesArr));
addToAlbum.addEventListener('click', loadImg);
photoGallery.addEventListener('focusout', saveChanges);
photoGallery.addEventListener('click', clickHandler);
searchInput.addEventListener('input', searchPhotos);
photoGallery.addEventListener('keydown', saveOnReturn);
showBtn.addEventListener('click', showPhotos);
searchBtn.addEventListener('click', searchPhotos);
favBtn.addEventListener('click', showFavs);
 
function clickHandler(e) {
  if(e.target.classList.contains('delete')) {
    deletePhoto(e);
  }
  else if(e.target.classList.contains('favorite')) {
    addFavorite(e);
  }
}

function loadPhotos(array) {
  imagesArr = [];
  array.forEach(function (photo) {
    var newPhoto = new Photo(photo.title, photo.caption, photo.id, photo.file, photo.favorite);
    imagesArr.push(newPhoto);
    displayPhoto(newPhoto);
  });
  var favorites = document.querySelectorAll('.favorite');
    for (var i = 0; i < favorites.length; i++) {
      if (JSON.parse(favorites[i].dataset.favorite)) { 
      increaseFavCounter();
      }
    }
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
            <div class="card-buttons delete" alt="Delete"></div>
            <div class="card-buttons favorite" data-favorite="${photoObj.favorite}" alt="Favorite"></div>
        </div>
      </article>`
    photoGallery.insertAdjacentHTML('afterbegin', photoCard);
    var msgPhoto = document.querySelector('#add-photo');
    msgPhoto.classList.add('add-photo');
    displayShowButton();
    showFavStatus(photoObj);
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

function addFavorite(e) {
  var card = e.target.closest('.photo-box');
  var cardId = parseInt(card.dataset.id);
  var matchingObj = imagesArr.find(photo => photo.id === cardId);
  if (matchingObj.favorite === false) {
    matchingObj.toggleFav(true);
    card.querySelector('.favorite').classList.add('favorite-active');
    increaseFavCounter();
  } else {
    matchingObj.toggleFav(false);
    card.querySelector('.favorite').classList.remove('favorite-active');
    decreaseFavCounter();
  }
    matchingObj.saveToStorage();
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

function showFavStatus(photoObj) {
  if (photoObj.favorite === true) {
    var matchingCard = document.querySelector(`[data-id="${photoObj.id}"]`);
    matchingCard.querySelector('.favorite').classList.add('favorite-active');
  }
}

function showFavs(e){
  e.preventDefault();
  removePhotos();
  var searchFavs = imagesArr.filter(function(photo){
    return photo.favorite;
  });
  searchFavs.forEach(function(element) {
    displayPhoto(element);
  });
}