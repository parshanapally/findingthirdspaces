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

    // Use hidden form submission instead of fetch to avoid CORS
    return new Promise((resolve, reject) => {
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'hidden_iframe_' + Date.now();
      document.body.appendChild(iframe);

      // Create a form
      const form = document.createElement('form');
      form.action = GOOGLE_SCRIPT_URL;
      form.method = 'POST';
      form.target = iframe.name;
      form.style.display = 'none';

      // Add form data as hidden inputs
      Object.keys(submissionData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = submissionData[key];
        form.appendChild(input);
      });

      // Set up cleanup function
      const cleanup = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      };

      // Handle iframe load (submission complete)
      iframe.onload = () => {
        setTimeout(() => {
          cleanup();
          resolve({ success: true, message: 'Form submitted successfully' });
        }, 1000);
      };

      // Handle iframe error
      iframe.onerror = () => {
        cleanup();
        reject(new Error('Form submission failed'));
      };

      // Add form to document and submit
      document.body.appendChild(form);
      
      // Submit after a short delay to ensure iframe is ready
      setTimeout(() => {
        form.submit();
      }, 100);

      // Fallback timeout after 15 seconds
      setTimeout(() => {
        cleanup();
        resolve({ success: true, message: 'Form submitted successfully (timeout)' });
      }, 15000);
    });
    
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
};