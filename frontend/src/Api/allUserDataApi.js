const getAllUsers = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/showAllUsers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Keep cookies/session
      }
    );

    if (!response.ok) {
      return { success: false, message: `API error: ${response.status}` };
    }

    const data = await response.json();
    // console.log("API Response:", data); // ✅ Debugging log

    if (data.success) {
      return { success: true, users: data.message }; // ✅ Correct key
    } else {
      return { success: false, message: data.message || "Failed to fetch users" };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong", error };
  }
};



const editUser = async (userId, updateData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/edit/${userId}`, {
      method: 'PUT', // or 'PATCH', depending on your backend
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData), // updateData is an object of new user values
    });

    if (!response.ok) {
      return { success: false, message: `API error: ${response.status}` };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Something went wrong', error };
  }
};


const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return { success: false, message: `API error: ${response.status}` };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Something went wrong', error };
  }
}



const setActiveStatus = async (userId, isActive) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/set-active-status/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ isActive }), // Send the active status as JSON
    });

    if (!response.ok) {
      return { success: false, message: `API error: ${response.status}` };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Something went wrong', error };
  }
};

export { getAllUsers, editUser, deleteUser, setActiveStatus };