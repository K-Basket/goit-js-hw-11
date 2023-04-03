import axios from 'axios';

export class PixabayApi {
  #API_KEY = '7971179-456b552bdb2500af743f56cc5';
  #BASE_URL = 'https://pixabay.com/api/';

  request = null;
  page = 1;
  totalImages = 0;

  searchOptions = {
    key: this.#API_KEY,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  async getPhotos() {
    const urlParams = new URLSearchParams({
      q: this.request,
      page: this.page,
      ...this.searchOptions,
    });

    const promise = await axios.get(`${this.#BASE_URL}?${urlParams}`);
    return await promise.data;
  }
}
