const getProfile = async () => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/current-user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        })

}
   
const updateAccountDetails = async (data) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users//update-account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update account: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating account details:", error);
    return { success: false, message: error.message };
  }
};

    
const showAllUsers = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/showAllUsers`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    }
                    })
                    if (!response.ok) {
                        throw new Error(`Failed to fetch users: ${response.status}`);
                        }
                        const result = await response.json();
                        return result;
                        } catch (error) {
                            console.error("Error fetching users:", error);
                            return { success: false, message: error.message };
                            }
                            }



export { getProfile, updateAccountDetails, showAllUsers };

