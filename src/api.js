const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all assets
export const fetchAssets = async () => {
  const response = await fetch(`${API_BASE_URL}/assets`);
  if (!response.ok) {
    throw new Error('Failed to fetch assets');
  }
  return response.json();
};

// Create a new asset
export const createAsset = async (assetData) => {
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assetData),
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to create asset');
  }

  return data;
};

// Fetch all tickets
export const fetchTickets = async () => {
  const response = await fetch(`${API_BASE_URL}/tickets`);
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  return response.json();
};

// Create a new ticket
export const createTicket = async (ticketData) => {
const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')){
    const text = await response.text();
    throw new Error('Server returned non-JSON  response(${response.status}): ${text.slice(0, 100)}');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create ticket');

  }
  return data;
};


// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
  const token = localStorage.getItem('token'); 

  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update ticket status');
  }

  return response.json();
};

// Update an existing asset
export const updateAsset = async (assetId, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update asset');
  }

  return data;
};

// Delete an asset
export const deleteAsset = async (assetId) => {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}`, {
    method: 'DELETE',
  });

  // Checks if response is actually JSON before parsing
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete asset');
    } else {
      throw new Error(`Server returned status ${response.status}. Make sure DELETE /api/assets/${assetId} exists in routes/asset.js and the server was restarted.`);
    }
  }

  return response.json();
};