const logoutApi = async () => { 
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
                });
                const data = await response.json();
                if (data.success) {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                    } else {
                        console.log(data);
                        }   
                        } catch (error) {
                            console.error(error);
                            }
                            };

export {logoutApi}