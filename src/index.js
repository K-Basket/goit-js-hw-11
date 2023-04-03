import { PixabayApi } from './js/pixabay-api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const btnloadMoreEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', onSearch);
btnloadMoreEl.addEventListener('click', onloadMore);

const pixabayApi = new PixabayApi();
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSearch(evt) {
  evt.preventDefault();
  pixabayApi.page = 1;

  pixabayApi.request = evt.currentTarget.elements.searchQuery.value;
  evt.currentTarget.reset();
  galleryEl.innerHTML = '';

  try {
    const data = await pixabayApi.getPhotos();
    console.log('Search:', data);

    saysNotFound(data);
    makeMarkup(data);
    sumLoadImages(data);
    addSimpleLightbox();
  } catch (error) {
    console.warn(error);
  }
}

async function onloadMore() {
  pixabayApi.page += 1;

  try {
    const data = await pixabayApi.getPhotos();
    console.log('Load:', data);

    makeMarkup(data);
    sumLoadImages(data);
    saysInfoLoad(data);
    addSimpleLightbox();
    addSmoothScroling();
  } catch (error) {
    console.warn(error);
  }
}

// функция создает разметку одной карточкм из массива объектов
function createPhotoCard(data) {
  return data.hits
    .map(el => {
      return `
    <div class="photo-card">
      <div class="image-wrap">
        <a href="${el.largeImageURL}"><img class="image" src="${el.largeImageURL}" alt="${el.type}: ${el.tags}" loading="lazy" /></a>
      </div>
      
      <div class="info">
        <p class="info-item">
          <b>Likes</b><br><span>${el.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b><br><span>${el.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b><br><span>${el.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b><br><span>${el.downloads}</span>
        </p>
      </div>
    </div>
    `;
    })
    .join('');
}

// функция рисует разметку в интерфейсе
function makeMarkup(data) {
  galleryEl.insertAdjacentHTML('beforeend', createPhotoCard(data));
}
// функция суммирует количество показанных картинок
function sumLoadImages(data) {
  return (pixabayApi.totalImages += data.hits.length);
}

// функция сообщает про отсутствие запрашиваемых изображений
function saysNotFound(data) {
  if (!data.hits.length) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  btnloadMoreEl.classList.remove('is-hidden');
}

// функция сообщает о финале всех загруженных картинок
function saysInfoLoad(data) {
  if (pixabayApi.totalImages === data.total) {
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );

    btnloadMoreEl.classList.add('is-hidden');

    return;
  }

  Notify.info(`Hooray! We found ${data.totalHits} images.`);
}

// функция добавляет библиотеку simpleLightbox
function addSimpleLightbox() {
  return simpleLightbox.refresh();
}

// функция делает плавный скролл
function addSmoothScroling() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
