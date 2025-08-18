const logoutApi = () => {
  return fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/logout`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",   // ✅ must be here, not in headers
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      return data;
    } else {
      return { success: false, message: 'Invalid username or password' };
    }
  })
  .catch(error => {
    return { success: false, message: 'Something went wrong', error };
  });
};

export { logoutApi };
