const getTodayEvents = () => {
  return fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/today-events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ✅ Keep cookies/session
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return data;
      } else {
        return { success: false, message: 'Failed to fetch today\'s events' };
      }
    })
    .catch(error => {
      return { success: false, message: 'Something went wrong', error };
    });
};

const getUpcomingEvents = () => {
  return fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/upcoming-events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ✅ Keep cookies/session
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return data;
      } else {
        return { success: false, message: 'Failed to fetch today\'s events' };
      }
    })
    .catch(error => {
      return { success: false, message: 'Something went wrong', error };
    });
};

export { getTodayEvents , getUpcomingEvents };



