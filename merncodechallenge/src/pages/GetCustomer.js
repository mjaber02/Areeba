import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log('Fetching users...');
    fetch('http://localhost:3001/getUsers')
      .then(response => response.json())
      .then(data => {
        console.log('Users:', data);
        setUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDelete = (userId) => {
    fetch(`http://localhost:3001/deleteUser/${userId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('User deleted:', data);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleUpdateClick = (user) => {
    const updatedName = window.prompt('Enter updated name:', user.name);
    const updatedAddress = window.prompt('Enter updated address:', user.address);
    const updatedMobileNumber = window.prompt('Enter updated mobile number:', user.mobileNumber);

    if (updatedName || updatedAddress || updatedMobileNumber) {
      
      const { _id } = user;
      fetch(`http://localhost:3001/updateUser/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedName,
          updatedAddress,
          updatedMobileNumber,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('User updated:', data.updatedCustomer);
          setUsers(prevUsers =>
            prevUsers.map(u => (u._id === _id ? data.updatedCustomer : u))
          );
        })
        .catch(error => console.error('Error updating user:', error));
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <div>
        {users.map(user => (
          <div key={user._id}>
            <strong>ID:</strong> {user._id}<br/>
            <strong>Name:</strong> {user.name}<br />
            <strong>Address:</strong> {user.address}<br />
            <strong>Mobile Number:</strong> {user.mobileNumber}<br />
            <button onClick={() => handleDelete(user._id)}>Delete</button>
            <button onClick={() => handleUpdateClick(user)}>Update</button>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
