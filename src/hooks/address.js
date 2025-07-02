import API from "../services/base_url";

export const fetchUserAddresses = async (user_id, token) => {
  try {
    const res = await API.get(`user-address/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: res.data, error: null };
  } catch (err) {
    const errorMsg =
      err.response?.data?.error || err.response?.data?.message || err.message;
    return { data: null, error: errorMsg };
  }
};
//http://localhost/projects/ecom/user-address/2
export const addUserAddress = async (form, token, user_id) => {
  console.log(
    "Form data from Address api : " +
      JSON.stringify(form) +
      "  Token  " +
      token +
      " User ID  " +
      user_id
  );
  try {
    const res = await API.post(`add-new-address/${user_id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: res.data, error: null };
  } catch (err) {
    const errorMsg =
      err.response?.data?.error || err.response?.data?.message || err.message;
    return { data: null, error: errorMsg };
  }
};

export const updateUserAddress = async (id, form, token) => {
  try {
    const res = await API.put(`/user/address/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: res.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const deleteUserAddress = async (id, token) => {
  try {
    const res = await API.delete(`/user/address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: res.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const setDefaultAddress = async (id, token) => {
  try {
    const res = await API.post(
      `/user/address/${id}/set-default`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { data: res.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};
