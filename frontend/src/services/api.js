const API_URL = process.env.REACT_APP_API_URL || 'https://dates.jorellsy.com/api';
console.log('API_URL:', API_URL);

// Auth endpoints
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};

// Profile endpoints
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

// Date endpoints
export const getDates = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_URL}/dates`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch dates');
  return response.json();
};

export const createDate = async (dateData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_URL}/dates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: dateData.title,
      description: dateData.description,
      date: dateData.date,
      location: dateData.location,
      location_name: dateData.location_name,
      latitude: dateData.latitude,
      longitude: dateData.longitude,
      estimated_budget: dateData.estimated_budget,
      status: dateData.status || 'planned'
    }),
  });
  if (!response.ok) throw new Error('Failed to create date');
  return response.json();
};

export const updateDate = async (dateid, dateData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/dates/${dateid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: dateData.title,
        description: dateData.description,
        date: dateData.date,
        location: dateData.location,
        location_name: dateData.location_name,
        latitude: dateData.latitude,
        longitude: dateData.longitude,
        estimated_budget: dateData.estimated_budget,
        status: dateData.status || 'planned'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update date');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating date:', error);
    throw error;
  }
};

export const deleteDate = async (dateid) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_URL}/dates/${dateid}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete date');
  return response.json();
};

// Date Ideas endpoints
export const getDateIdeas = async () => {
  const response = await fetch(`${API_URL}/date-ideas`);
  if (!response.ok) throw new Error('Failed to fetch date ideas');
  return response.json();
};

export const createDateIdea = async (ideaData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  try {
    console.log('Sending request to create date idea:', ideaData);
    const response = await fetch(`${API_URL}/date-ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: ideaData.content,
        userId: ideaData.userId,
        username: ideaData.username
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      throw new Error(errorData.message || 'Failed to create date idea');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createDateIdea:', error);
    throw error;
  }
};

export const updateDateIdea = async (dateId, ideaData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  console.log('Making update request to:', `${API_URL}/date-ideas/${dateId}`);
  console.log('Update request data:', ideaData);
  console.log('Auth token:', token);

  try {
    const response = await fetch(`${API_URL}/date-ideas/${dateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: ideaData.content,
        userId: ideaData.userId,
        username: ideaData.username
      }),
    });

    console.log('Update response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update error response:', errorData);
      throw new Error(errorData.message || 'Failed to update date idea');
    }

    const result = await response.json();
    console.log('Update successful, received:', result);
    return result;
  } catch (error) {
    console.error('Error in updateDateIdea:', error);
    throw error;
  }
};

export const deleteDateIdea = async (dateId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const userData = JSON.parse(localStorage.getItem('user'));
  if (!userData || !userData.id) throw new Error('No user data found');

  const response = await fetch(`${API_URL}/date-ideas/${dateId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: userData.id
    })
  });
  if (!response.ok) throw new Error('Failed to delete date idea');
  return response.json();
}; 