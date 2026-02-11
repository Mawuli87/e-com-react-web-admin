// import { createStore, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
// import { composeWithDevTools } from "@redux-devtools/extension";
// import rootreducers from "./redux/reducers/main";

// const middleware = [thunk];

// const store = createStore(
//   rootreducers,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;

// store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/reducers/main";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(), // thunk is included by default
  devTools: true,
});

export default store;
