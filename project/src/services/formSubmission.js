export const submitSpaceToGoogleSheets = async (formData) => {
  try {
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

    // Use form submission instead of fetch to avoid CORS
    return new Promise((resolve, reject) => {
      // Create a hidden iframe to submit the form
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'hidden_iframe';
      document.body.appendChild(iframe);

      // Create a form
      const form = document.createElement('form');
      form.action = GOOGLE_SCRIPT_URL;
      form.method = 'POST';
      form.target = 'hidden_iframe';

      // Add form data as hidden inputs
      Object.keys(submissionData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = submissionData[key];
        form.appendChild(input);
      });

      // Handle iframe load (submission complete)
      iframe.onload = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve({ success: true, message: 'Form submitted successfully' });
      };

      // Handle iframe error
      iframe.onerror = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        reject(new Error('Form submission failed'));
      };

      // Submit the form
      document.body.appendChild(form);
      form.submit();

      // Timeout after 10 seconds
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
          document.body.removeChild(form);
          resolve({ success: true, message: 'Form submitted (timeout)' });
        }
      }, 10000);
    });
    
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
};