const backendURL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_EXTERNAL_BACKEND_URL;

export async function fetchCustomerData() {
  try {
    const response = await fetch(`${backendURL}/api/customer/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw error;
  }
}
