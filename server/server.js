const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());


const mongoURL = 'mongodb://localhost:27017/areeba';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});


db.once('open', () => {
  console.log('Connected to MongoDB');
});


const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  mobileNumber: { type: String, required: true },
});


const Customer = mongoose.model('Customer', customerSchema);

// Validation microservice API
app.post('/validate-mobile-number', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Perform mobile number validation logic here
    const validationResponse = await axios.get(
      `https://phonevalidation.abstractapi.com/v1?api_key=e2119e7f66ee4f798e3c7a2ee2a0d33e&phone=${mobileNumber}`
    );

    
    const sanitizedResponse = {
      valid: validationResponse.data.valid,
      country: validationResponse.data.country,
      carrier: validationResponse.data.carrier,
    };

    console.log(sanitizedResponse);

    

    res.json(sanitizedResponse);
  } catch (error) {
    console.error('Error validating mobile number:', error.message);
    res.status(500).json({
      error: 'Error validating mobile number. Please try again or check the provided number.',
    });
  }
});

//ADD customer API
app.post('/add-customer', async (req, res) => {
  const { name, address, mobileNumber } = req.body;
  console.log("Received data", req.body);

  try {
    const newCustomer = new Customer({
      name: name,
      address: address,
      mobileNumber: mobileNumber,
    });

    await newCustomer.save();

    console.log('Customer added successfully:', newCustomer);

    res.json({
      message: 'Customer added successfully',
      customer: newCustomer,
    });
  } catch (error) {
    console.error('Error adding customer to the database:', error);
    console.log('Received data:', req.body);
  
    console.log('Error details:', error.message);
    console.log('Error stack trace:', error.stack);
  
    res.status(500).json({ error: 'Error adding customer to the database', details: error.message });
  }
});

//GET users API
app.get('/getUsers', (req, res) => {
  Customer.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
});
//DELETE user API
app.delete('/deleteUser/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await Customer.findByIdAndDelete(userId);

    if (deletedUser) {
      console.log('User deleted successfully:', deletedUser);
      res.json({ message: 'User deleted successfully', deletedUser });
    } else {
      console.log('User not found');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Update Customer API
app.put('/updateUser/:customerId', async (req, res) => {
  const customerId = req.params.customerId;
  const { updatedName, updatedAddress, updatedMobileNumber } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        name: updatedName,
        address: updatedAddress,
        mobileNumber: updatedMobileNumber,
      },
      { new: true } 
    );

    if (updatedCustomer) {
      console.log('Customer updated successfully:', updatedCustomer);
      res.json({ message: 'Customer updated successfully', updatedCustomer });
    } else {
      console.log('Customer not found');
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error updating customer:', error.message);
    res.status(500).json({ error: 'Error updating customer' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
