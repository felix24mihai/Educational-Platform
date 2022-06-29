import {
  GET_ARTICLES,
  GET_ARTICLE,
  ARTICLE_ERROR,
  UPDATE_LIKES,
  UPDATE_DISLIKES,
  DELETE_ARTICLE,
  ADD_ARTICLE,
} from '../actions/types';

const initialState = {
  article: null,
  articles: [],
  loading: true,
  error: {},
};

export default function ArticleReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ARTICLES:
      return {
        ...state,
        articles: payload,
        loading: false,
      };
    case GET_ARTICLE:
      return {
        ...state,
        article: payload,
        loading: false,
      };
    case ADD_ARTICLE:
      return {
        ...state,
        articles: [payload, ...state.articles],
        loading: false,
      };
    case ARTICLE_ERROR:
      return {
        ...state,
        article: null,
        articles: [],
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
    case UPDATE_DISLIKES:
      return {
        ...state,
        articles: state.articles.map((article) =>
          article._id === payload.articleId
            ? { ...article, likes: payload.likes, dislikes: payload.dislikes }
            : article
        ),
      };
    case DELETE_ARTICLE:
      return {
        ...state,
        articles: state.articles.filter((article) => article._id !== payload),
        loading: false,
      };
    default:
      return state;
  }
}
