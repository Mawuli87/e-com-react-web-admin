// src/services/categoryService.js

import API from "../services/base_url";

export const registerUser = async (formData) => {
  try {
    const response = await API.post(`register`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: "Unexpected server response" };
    }
  } catch (error) {
    let message = "Something went wrong";
    if (error.response?.data?.error) {
      message = error.response.data.error;
    }
    return { success: false, error: message };
  }
};

export const loginUser = async (formData) => {
  try {
    const res = await API.post("login", formData); // Adjust endpoint as needed
    console.log("Login Data " + res.data.data);
    return res.data.data;
  } catch (err) {
    return {
      error:
        err.response?.data?.error || "Login failed. Please check credentials.",
    };
  }
};

// hooks/api.js

export const sendResetPasswordEmail = async (email) => {
  try {
    const res = await fetch("http://localhost:8000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    return { error: "Network error" };
  }
};

export const fetchCategories = async () => {
  try {
    // Retrieve token (e.g. from localStorage)

    const response = await API.get("categories");

    if (response.status === 200) {
      return { data: response.data.categories || [], error: null };
    } else {
      throw new Error("Unexpected response");
    }
  } catch (err) {
    return { data: [], error: err.message || "Failed to fetch categories" };
  }
};

export const fetchSliders = async () => {
  try {
    const response = await API.get("sliders");

    if (response.status === 200) {
      return { data: response.data.sliders || [], error: null };
    } else {
      throw new Error("Unexpected response");
    }
  } catch (err) {
    return { data: [], error: err.message || "Failed to fetch sliders" };
  }
};

export const fetchFeaturedProducts = async () => {
  try {
    const response = await API.get("features");

    if (response.status === 200) {
      return { data: response.data.featured || [], error: null };
    } else {
      throw new Error("Unexpected response");
    }
  } catch (err) {
    return {
      data: [],
      error: err.message || "Failed to fetch featured products",
    };
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await API.get(`product/${id}`);

    if (response.status === 200) {
      return { data: response.data, error: null };
    } else {
      return { data: null, error: "Unexpected response" };
    }
  } catch (error) {
    return {
      data: null,
      error: error?.response?.data?.error || "Failed to fetch product",
    };
  }
};

// export const submitCheckout = async (data, token) => {
//   try {
//     const response = await API.post("/checkout", data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (err) {
//     return { error: err.response?.data?.error || "Checkout failed" };
//   }
// };
export const submitCheckout = async (payload, token) => {
  try {
    const res = await API.post("checkout", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data) {
      console.log("✅ Response from checkout API:", res.data);
      return {
        success: true,
        order_id: res.data.order_id,
        message: res.data.message,
      };
    } else {
      return { error: "No order ID returned from server" };
    }
  } catch (err) {
    return { error: err.message || "Checkout failed" };
  }
};
