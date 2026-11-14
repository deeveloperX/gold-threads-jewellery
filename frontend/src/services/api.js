const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const fallbackMessage = (status) => {
  if (status === 400) return 'Please check the information and try again.';
  if (status === 401) return 'Please sign in again to continue.';
  if (status === 403) return 'You do not have permission to do that.';
  if (status === 404) return 'The requested item could not be found.';
  if (status === 502) return 'An image upload failed. Please try again.';
  return 'Something went wrong. Please try again.';
};

export async function apiRequest(path, options = {}) {
  const { authToken, headers, ...requestOptions } = options;
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers: {
        Accept: 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
    });
  } catch (requestError) {
    console.error('API request failed:', requestError);
    throw new Error('Unable to connect right now. Please try again.', { cause: requestError });
  }

  const contentType = response.headers.get('content-type') || '';
  let responseText;
  try {
    responseText = await response.text();
  } catch (readError) {
    console.error('Unable to read API response:', readError);
    throw new Error('Something went wrong. Please try again.', { cause: readError });
  }
  let data = null;
  if (contentType.includes('application/json') && responseText) {
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('API returned invalid JSON:', parseError);
    }
  }

  if (!response.ok) {
    const error = new Error(
      typeof data?.message === 'string' ? data.message : fallbackMessage(response.status),
    );
    error.status = response.status;
    throw error;
  }

  if (!data) {
    console.error('API returned an unexpected response.');
    throw new Error('Something went wrong. Please try again.');
  }

  return data;
}
