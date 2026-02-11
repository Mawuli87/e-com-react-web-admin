import { combineReducers } from "redux";
import { getProductsreducer } from "./Productsreducer";

const rootreducers = combineReducers({
  getproductsdata: getProductsreducer,
});

export default rootreducers;
