import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';

const Dashboard = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/books')
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.log('Error from Dashboard');
      });
  }, []);

  const bookList =
    books.length === 0
      ? 'there are no restaurants'
      : books.map((book, k) => <BookCard book={book} key={k} />);

  return (
    <div>
      <h1>Manage My Lunch Dashboard</h1>
      <button>Account</button>
      <button>Sign out</button>

      <div className='ShowBookList'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <br />
              <h2 className='display-4 text-center'>Restaurants</h2>
            </div>

            <div className='col-md-11'>
              <Link
                to='/create-book'
                className='btn btn-outline-warning float-right'
              >
                + Add a Restaurant
              </Link>
              <br />
              <br />
              <hr />
            </div>
          </div>

          <div className='list'>{bookList}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
