import {startModalWiNoTreiler} from '../modal-w-litle/modal-w-litle.js';
import {styleUpcomingThisMonth} from '../js-header/header.js';

// Функция для выполнения запроса к API
async function fetchFilmData() {
  const apiKey = '9073999c285844087924fd0e24160fae';
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Месяцы в объекте Date нумеруются с 0, поэтому добавляем 1
  const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
  const lastDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`;
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${firstDayOfMonth}&primary_release_date.lte=${lastDayOfMonth}`;
  console.log(apiUrl); // Выводим полученный массив фильмов в консоль

  try {
 
    const response = await fetch(apiUrl);
    const filmData = await response.json();
    const films = filmData.results;
  // Выводим полученный массив фильмов в консоль для проверки//
  console.log(films);
  return films;

  } catch (error) {
    console.error('Ошибка при выполнении запроса к API:', error);
    return null;
  }
}


// Функция для создания HTML разметки карточки фильма
async function createFilmCard() {
  const cardContainer = document.querySelector('.upcoming_film_card');
  if (!cardContainer) {
      // Если элемент .upcoming_film_card не существует на текущей странице, прекращаем выполнение функции
    return;
  }

  try {
    const films = await fetchFilmData();

    if (films && films.length > 0) {
      const randomFilm = films[Math.floor(Math.random() * films.length)];
    const cardHTML = `
        <div class="film-card">
        <img src="https://image.tmdb.org/t/p/original/${randomFilm.backdrop_path}" alt="${randomFilm.original_title}" />
          <div class="film-info">
            <div class="info-item">
            <h2 class="film-title">${randomFilm.original_title}</h2>
  
            </div>
  
            <div class="container-features">
              <div class="column-struct">
                <div class="date-vote">
                  <div class="info-item">
                    <span class="release">Release Date:</span>
                    <span class="release-value release-date">${
                      randomFilm.release_date
                    }</span>
                  </div>
                  <div class="info-item">
                    <span class="vote">Vote / Votes:</span>
                    <span class="vote-value">
                      <span class="vote-average">${randomFilm.vote_average}</span> /
                      <span class="vote-count">${randomFilm.vote_count}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="column-struct">
                <div class="popularity-genre">
                  <div class="info-item">
                    <span class="popularity">Popularity:</span>
                    <span class="popularity-value">${randomFilm.popularity}</span>
                  </div>
                  <div class="info-item genre-item">
                    <span class="genre">Genre:</span>
                    <span class="genre-value">${randomFilm.genres
                      .map(genre => genre.name)
                      .join(', ')}</span>
                  </div>
                </div>
              </div>
              <div class="description-item">
                <span class="description-about">About:</span>
                <span class="about-value">${randomFilm.overview}</span>
              </div>
            </div>
  
  
            <button class="button-rem-me">Add to My Library</button>
          </div>
        </div>
      `;

    cardContainer.innerHTML = cardHTML;
    // setTimeout(styleUpcomingThisMonth, 0);

  } else {
    // Если фильмы не найдены, отображаем модальное окно
    startModalWiNoTreiler();
  }
} catch (error) {
  console.error('Ошибка при создании карточки фильма:', error);
}
}

    // Округляем значения до десятков
    const popularityValueElement = document.querySelector('.popularity-value');
    popularityValueElement.textContent = (
      Math.round(randomFilm.popularity / 10) * 10
    ).toFixed(1);
    
    const voteAverageElement = document.querySelector('.vote-average');
    voteAverageElement.textContent = (
      Math.round(randomFilm.vote_average / 10) * 10
    ).toFixed(1);

    // Проверяем наличие фильма в Local Storage и обновляем состояние кнопки
    const addButton = document.querySelector('.button-rem-me');
    const filmData = JSON.parse(localStorage.getItem('libraryFilms')) || {};

    if (filmData.hasOwnProperty(film.original_title)) {
      addButton.textContent = 'Remove from My Library';
    }

    // Добавляем обработчик события для кнопки после создания карточки фильма
    addButton.addEventListener('click', toggleLibraryFilm.bind(null, film));

    // Изменяем формат даты. При изменении названия классов в разметке, изменить класс ниже
    const releaseDateElement = document.querySelector(
      '.release-value.release-date'
    );
    const releaseDate = film.release_date;
    const formattedDate = formatDate(releaseDate);
    releaseDateElement.textContent = formattedDate;
  


// Функция для преобразования формата даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
formatDate(randomFilm.release_date);

function isFilmInLibrary(film) {
  let libraryFilms = JSON.parse(localStorage.getItem('libraryFilms')) || [];

  const index = libraryFilms.findIndex(storedFilm => storedFilm.id === film.id);

  return index !== -1;
}

function updateButtonStatus(film) {
  const addButton = document.querySelector('.button-rem-me');

  if (isFilmInLibrary(film)) {
    addButton.textContent = 'Remove from My Library';
  } else {
    addButton.textContent = 'Add to My Library';
  }
}

function toggleLibraryFilm(film) {
  const addButton = document.querySelector('.button-rem-me');

  let libraryFilms = JSON.parse(localStorage.getItem('libraryFilms')) || [];

  if (addButton.textContent === 'Add to My Library') {
    addButton.textContent = 'Remove from My Library';

    libraryFilms.push(film);
  } else {
    addButton.textContent = 'Add to My Library';
    const index = libraryFilms.findIndex(
      storedFilm => storedFilm.id === film.id
    );
    if (index !== -1) {
      libraryFilms.splice(index, 1);
    }
  }

  localStorage.setItem('libraryFilms', JSON.stringify(libraryFilms));

}

// Вызываем функции для получения массива фильмов и создания карточки фильма
fetchFilmData().then(films => {
  if (films && films.length > 0) {
    const randomFilm = films[Math.floor(Math.random() * films.length)];
    // Создаем карточку фильма с помощью функции createFilmCard()
    createFilmCard(randomFilm);
  }
});
