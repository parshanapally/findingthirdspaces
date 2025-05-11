import React, { useState } from 'react';
import { SpaceType, spaceTypeLabels } from '../types';
import { Upload, Check } from 'lucide-react';

const SubmitForm: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '' as SpaceType | '',
    description: '',
    address: '',
    city: '',
    amenities: [] as string[],
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, value]
        : prev.amenities.filter(a => a !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        type: '',
        description: '',
        address: '',
        city: '',
        amenities: [],
        email: ''
      });
    }, 3000);
  };

  const amenitiesOptions = [
    'Free Wi-Fi',
    'Power outlets',
    'Coffee/Tea',
    'Food service',
    'Quiet areas',
    'Meeting spaces',
    'Outdoor seating',
    'Accessible facilities'
  ];

  return (
    <section id="submit" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-indigo-600 p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Submit a Space</h2>
              <p className="mb-6 opacity-90">
                Know a great third space that should be on our platform? Submit it here and help others discover meaningful places.
              </p>
              <ul className="space-y-2 opacity-80">
                <li className="flex items-center">
                  <Check size={16} className="mr-2" />
                  <span>Free submission</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2" />
                  <span>Quick review process</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2" />
                  <span>Help grow the community</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 md:w-2/3">
              {formSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-4">
                    Your space has been submitted successfully. Our team will review it shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Space Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type of Space*
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="">Select a type</option>
                      {Object.entries(spaceTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address*
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City, State*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {amenitiesOptions.map(amenity => (
                        <div key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`amenity-${amenity}`}
                            name="amenities"
                            value={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label 
                            htmlFor={`amenity-${amenity}`} 
                            className="ml-2 text-sm text-gray-700"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll contact you if we need more information about this space.
                    </p>
                  </div>
                  
                  <div className="mb-6 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="flex flex-col items-center">
                      <Upload size={24} className="text-gray-500 mb-2" />
                      <p className="text-sm text-gray-700 mb-1">
                        Upload photos (optional)
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop files here or click to browse
                      </p>
                      <input type="file" className="hidden" accept="image/*" multiple />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Submit Space
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitForm;