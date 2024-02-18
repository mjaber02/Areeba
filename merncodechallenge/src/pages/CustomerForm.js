import React, { useState } from 'react';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: '',
  });

  const [validationInfo, setValidationInfo] = useState({
    valid: null,
    countryCode: '',
    countryName: '',
    carrier: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateMobileNumber = async () => {
    try {
      const response = await fetch('http://localhost:3001/validate-mobile-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber: formData.mobileNumber }),
      });

      if (!response.ok) {
        console.error('Mobile number validation failed. Response:', response);
        return {
          valid: false,
          countryCode: '',
          countryName: '',
          carrier: '',
        };
      }

      const validationData = await response.json();
      return {
        valid: validationData.valid,
        countryCode: validationData.country.code,
        countryName: validationData.country.name,
        carrier: validationData.carrier,
      };
    } catch (error) {
      console.error('Error validating mobile number:', error);
      return {
        valid: false,
        countryCode: '',
        countryName: '',
        carrier: '',
      };
    }
  };

  const handleSubmit = async () => {
    try {
      // Check if any of the required fields is empty
      if (!formData.name || !formData.address || !formData.mobileNumber) {
        alert('All fields are required');
        return;
      }
  
      // Validate mobile number
      const validationInfo = await validateMobileNumber();
  
      // Set validation information
      setValidationInfo(validationInfo);
  
      if (!validationInfo.valid) {
        console.error('Invalid mobile number. Please fix the mobileNumber.');
        return;
      }
  
      // Continue with form submission
      const response = await fetch('http://localhost:3001/add-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully submitted:', responseData.customer);
        setFormData({
          name: '',
          address: '',
          mobileNumber: '',
        });
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  return (
    <div>
      <h2>Customer Information Form</h2>
      <form>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label htmlFor="mobileNumber">Mobile Number:</label>
        <input
          type="tel"
          id="mobileNumber"
          name="mobileNumber"
          placeholder="Enter mobile number"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
        />

        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      {validationInfo.valid !== null && (
        <div>
          <h3>Validation Information</h3>
          <p>Valid: {validationInfo.valid ? 'Yes' : 'No , fix the mobile number'}</p>
          <p>Country Code: {validationInfo.countryCode}</p>
          <p>Country Name: {validationInfo.countryName}</p>
          <p>Carrier: {validationInfo.carrier}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
