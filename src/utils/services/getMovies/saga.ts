/**
 * getMovies saga
 */

import { all, put, takeLatest } from 'redux-saga/effects';
import { axios } from '..';

/** ACTIONS */
import {
  getMoviesSuccessAction,
} from './actions';
import {
  getErrorAction,
} from '../getError/actions';

/** CONSTANTS */
import { MOVIES_ACTION_REQUEST } from './constants';

/**
 * @function getMovies
 * @yields getMoviesSuccessAction / getErrorAction
 */
export function * getMovies ({ genreId, title, limit, offset }: any): any {
  const params: any = {
    order_by: 'date', 
    type: 'movie',
    limit, 
    offset
  }

  if (genreId) {
    params.genre_list = genreId
  }

  if (title) {
    params.title = title
  }

  try {
    if (genreId || title) {
      const { 
        results: data, 
      } = yield axios.get('/search/titles', { params }).then(response => response.data)

      yield put(getMoviesSuccessAction(data))
    }
  } catch (err: any) {
    yield put(getErrorAction(err.message))
  }
};

/**
 * @function watchMoviesAction
 * @yields getMovies
 */
export function * watchMoviesAction () {
  yield takeLatest(MOVIES_ACTION_REQUEST, getMovies)
};

/**
 * @function saga
 * @yields all actions required
 */
export default function * saga () {
  yield all([
    watchMoviesAction(),
  ])
};
