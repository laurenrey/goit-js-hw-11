import axios from 'axios';

export async function fetchImg(searchQuery, page) {
  const key = '29750578-eee0acb86335d7ce904d8b56e';
  const response = await axios.get(
    `https://pixabay.com/api/?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return response.data;
}
