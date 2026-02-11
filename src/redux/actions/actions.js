//here we use redux thunk
export const getProducts = () => async (dispatch) => {
  try {
    const res = await fetch("/productdata.json");
    const data = await res.json();
    dispatch({ type: "SUCCESS_GET_PRODUCTS", payload: data });
  } catch (error) {
    dispatch({ type: "FAIL_GET_PRODUCTS", payload: error.message });
  }
};

// import products from "../assets/productdata.js";

// export const getProducts = () => (dispatch) => {
//   try {
//     dispatch({ type: "SUCCESS_GET_PRODUCTS", payload: products });
//   } catch (error) {
//     dispatch({ type: "FAIL_GET_PRODUCTS", payload: error.message });
//   }
// };
