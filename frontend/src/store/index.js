import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { csrfFetch, restoreCSRF } from "./csrf";
import thunk from "redux-thunk";
import * as sessionActions from './session';
import sessionReducer from "./session";

const rootReducer = combineReducers({
  // add reducer functions here
  session: sessionReducer
});

let enhancer;

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}



if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}


export default configureStore;
