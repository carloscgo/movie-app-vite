import { createSelector } from 'reselect'

import { initialState } from './reducer'

/**
 * Direct selector to the genres state domain
 */

export const selectDomain = state => state.genres || initialState

/**
 * @function makeDataSelector
 * @return {string} data from state
 */
export const makeDataSelector = () =>
  createSelector(
    selectDomain,
    substate => substate
  )
