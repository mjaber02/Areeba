import React from 'react';
import CustomerForm from "./pages/CustomerForm";
import UserList from "./pages/GetCustomer";


function App() {
  return (
    <div style={styles.appContainer}>
      <div style={{ ...styles.side, ...styles.left }}>
        <CustomerForm />
      </div>
      <div style={{ ...styles.side, ...styles.right }}>
        <UserList />
      </div>
     
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100vh',
  },
  side: {
    flex: 1,
    padding: '20px',
    boxSizing: 'border-box',
  },
  left: {
    backgroundColor: '#e0e0e0', 
  },
  right: {
    backgroundColor: '#f0f0f0', 
  },
  bottom: {
    backgroundColor: '#d0d0d0', 
  },
};

export default App;
