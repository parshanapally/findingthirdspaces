export const submitSpaceToGoogleSheets = async (formData) => {
  try {
    // Paste your Web App URL here
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBJISXobWTt2y7teqpUaUfo2y3RWtbj9SDphpvr0I3tPLqops_yuory4eBbWUbs56X/exec';
    
    const submissionData = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      amenities: formData.amenities.join(', '),
      email: formData.email,
      status: 'Pending Review'
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
};