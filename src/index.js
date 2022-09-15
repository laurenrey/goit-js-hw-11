import { fetchImg } from './fetch-img';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const seachForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');

seachForm.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onBtnLoadMore);

let searchQuery = '';
let page = 1;
let hits = 0;

let simpleLightbox = new SimpleLightbox('.gallery a ', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

async function onSearch(e) {
  e.preventDefault();
  cleanSearch();
  btnHidden();

  try {
    searchQuery = e.currentTarget.searchQuery.value;
    page = 1;

    if (searchQuery === '') {
      return;
    }

    const response = await fetchImg(searchQuery, page);
    hits = response.hits.length;

    if (response.totalHits > 40) {
      btnShown();
    } else {
      btnHidden();
    }

    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

      cleanSearch();
      renderGallery(response.hits);
    }

    if (response.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      cleanSearch();
      btnHidden();
    }
  } catch {
    console.error();
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * -50,
    behavior: 'smooth',
  });
}

async function onBtnLoadMore() {
  page += 1;
  try {
    const response = await fetchImg(searchQuery, page);
    renderGallery(response.hits);

    hits += response.hits.length;
    if (hits === response.totalHits) {
      btnLoadMore.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}

function btnHidden() {
  btnLoadMore.classList.add('is-hidden');
}
function btnShown() {
  btnLoadMore.classList.remove('is-hidden');
}

function cleanSearch() {
  gallery.innerHTML = '';
}

function renderGallery(hits) {
  const markup = hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}" rel="noopener noreferrer">
    
      <img class=gallery__image"" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <p><b>Likes</b> <br>${hit.likes}</br></p>
        </p>
        <p class="info-item">
          <p><b>Views</b> <br>${hit.views}</br></p>
        </p>
        <p class="info-item">
          <p><b>Comments</b> <br>${hit.comments}</br></p>
        </p>
        <p class="info-item">
          <p><b>Downloads</b> <br>${hit.downloads}</br></p>
        </p>
      </div>
      </a>
    </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightbox.refresh();
}
