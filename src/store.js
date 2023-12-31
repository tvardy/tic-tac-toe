import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      if (state.winner == null) {
        const newValues = state.values.map((value, index) => index === action.payload.index && value === null ? action.payload.value : value);
        let somethingChanged = state.values.join("") != newValues.join("");
        let newNextMove = state.nextMove;
        if (somethingChanged) {
          newNextMove = action.payload.value === 1 ? 0 : 1
        }
        return {
          ...state,
          values: newValues,
          nextMove: newNextMove
        };
      } else {
        return state;
      }
    case 'START_AGAIN':
      return {...initialState};
    case 'CHECK_WINNER':
      let isWin = false;
      let winner = null;
      let xWins = state.xWins;
      let oWins = state.oWins;
      let winningCombination = null;
      state.combinations.forEach((combination) => {
        isWin = combination.every((element, index, array) => {
          return state.values[element] !== null && state.values[element] === state.values[array[0]];
        })
        if (isWin) {
          winner = state.values[combination[0]];
          winningCombination = combination;
          if (winner == 0) {
            xWins++;
          } else {
            oWins++;
          }
        }
      })
      if (!winner && state.values.every((element) => element)) {
        winner = "draw";
      }
      return {
        ...state,
        xWins: xWins,
        oWins: oWins,
        winner: winner,
        winningCombination,
      }
    case 'WHO_PLAYS_FIRST':
      let nextMove = action.payload;
      console.log(nextMove);
      return {
        ...state,
        nextMove,
      }
    case 'SET_BOARD_SIZE':
      let boardSize = action.payload;
      return {
        ...state,
        size: boardSize,
      }

    case 'VALUES':
      const values = Array(action.payload ** 2).fill(null);
      const combinations = [];
      const size = action.payload;
      // rows 
      for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
          row.push(j + (i * size))
        }
        combinations.push(row);
      }

      // columns
      for (let i = 0; i < size; i++) {
        let column = [];
        for (let j = 0; j < size; j++) {
          column.push(j * size + i)
        }
        combinations.push(column);
      }

      // diagonals 
      for (let i = 0; i < 2; i++) {
        let diagonal = [];
        for (let j = 0; j < size; j++) {
          if (i == 0) {
            diagonal.push(j * size + j)
          } else if (i == 1) {
            diagonal.push((size - 1) * (j + 1))
          }
        }
        combinations.push(diagonal);
      }
      return {
        ...state,
        combinations,
        values,
        winningCombination: null,
        winner: null,
      }
    default:
      return state;
  }
};

export const onFieldClick = payload => {
  return (dispatch) => {
    dispatch(setFieldValue(payload));
    dispatch(checkWinner());
  }
}

export const reset = () => {
  return (dispatch, getState) => {
    const state = getState(); 
    //console.log(state.size);
    dispatch(values(state.size)); 
  }
}

//Actions
export const setFieldValue = payload => ({ type: "SET_FIELD_VALUE", payload });
export const checkWinner = () => ({ type: "CHECK_WINNER" });
export const startAgain = () => ({ type: "START_AGAIN" });
export const playsFirst = payload => ({ type: "WHO_PLAYS_FIRST", payload });
export const boardSize = payload => ({ type: "SET_BOARD_SIZE", payload });
export const values = payload => ({ type: "VALUES", payload });

const initialState = {
  nextMove: null,
  combinations: [],
  values: [],
  size: 0,
  xWins: 0,
  oWins: 0,
  winner: null,
  winningCombination: null,
};

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk)),
);

export default store;














