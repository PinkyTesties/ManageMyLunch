import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get('http://localhost:8082/api/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  const deleteUsers = (id) => {
    axios
      .delete(`http://localhost:8082/api/users/${id}`)
      .then((res) => {
        alert("Force Deletion of user successful", res.data.msg);
        fetchUsers(); // Refresh the users list after deletion
      })
      .catch((err) => alert(err.response.data.error));
  };

  const boxStyle = {
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
  };

  return (
    <div>
      <h1>Users</h1>
      <button><Link to={'/Dashboard'}>Dashboard</Link></button>

      {users.map((user) => (
        <div key={user._id} style={boxStyle}>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Date Added: {new Date(user.date_added).toLocaleDateString()}</p>
          <button onClick={() => deleteUsers(user._id)}>Force Delete User</button>

        </div>
      ))}
    </div>
  );
};

export default Users;