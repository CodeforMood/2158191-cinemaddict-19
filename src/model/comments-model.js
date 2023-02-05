import { mockComments } from '../mock/data.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #movieComments = mockComments;
  #moviesModel = null;
  #commentsApiService = null;

  constructor({moviesModel, commentsApiService}) {
    super();
    this.#moviesModel = moviesModel;
    this.#commentsApiService = commentsApiService;
    const movieId = '1';

    this.#commentsApiService.getComments(movieId).then((comments) => {
      console.log(comments);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }

  get comments() {
    return this.#movieComments;
  }

  getCommentsToFilm(filmId) {
    return this.#moviesModel.moviesData.find((movieData) => movieData.id === filmId).comments.map((comment) => this.comments.find((movieComment) => String(comment) === movieComment.id));
  }

  addComment(updateType, update) {
    this.#movieComments = [
      update,
      ...this.#movieComments,
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this.#movieComments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting movie');
    }

    this.#movieComments = [
      ...this.#movieComments.slice(0, index),
      ...this.#movieComments.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
