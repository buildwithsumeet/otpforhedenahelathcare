const getCurrentUsers = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/current-user`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    const data = await response.json();
    // console.log("Current User Data:", data);

    if (data.success) {
      return { success: true, user: data.message }; // ✅ Correct: user is inside `data.data`
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong", error };
  }
};


export { getCurrentUsers };