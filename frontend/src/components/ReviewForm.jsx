/*
ReviewForm.jsx

This component is used to display a form for the user to write a review for a restaurant. This is called from the order status page when the user has completed an order.
Once complete it is submitted to the database and redirected back to order status.

Created by Tyler Costa 19075541

*/

//React imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import logo from './componentAssets/logov1.png';

=======
//Header
import UserDashboard from './UserDashboard';
//Footer
import Footer from './sharedComponents/Footer';
//Styles
import '../style/reviewForm.css';
>>>>>>> origin/main

const ReviewForm = () => {
  //Variables
  const { id } = useParams();
  const navigate = useNavigate();

  //create review object
  const [review, setReview] = useState({
    name: '',
    stars: '',
    title: '',
    textarea: '',
    restaurantID: id // Set the restaurant ID to the one from the URL
  });
  const [restaurant, setRestaurant] = useState(null);

  //Fetch the restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurant();
  }, [id]);

  //Handle the change of the input fields
  useEffect(() => {
    setReview(prevReview => ({ ...prevReview, restaurantID: id }));
  }, [id]);

  //Handle the change of the input fields
  const handleChange = e => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  //Handle the submit of the form
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/reviewForm', review);
      // Show an alert to the user that the review was submitted successfully
      alert('Review submitted successfully');
      // Reset the form

      navigate('/OrderStatus');

    } catch (err) {
      console.error(err);
    }
  };

  //Render the review form
  return (
    <div>
<<<<<<< HEAD
      <header>
        <img src={logo} alt='Logo' height={100} />
        <h1>Review Form</h1>
        <p></p>
      </header>
      <hr />
      <p className="lead text-center"><b>Restaurant Name:</b> {restaurant ? restaurant.restaurantName : 'Loading...'}</p>
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <br />
            <p className="lead text-center">Your Personal Review</p>
          </div>
          <div className="col-md-10 m-auto">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Name:
                  </label>
                  <input type="text" name="name" className="form-control" value={review.name} onChange={handleChange} required />
              </div>
              <br />
              <div className="form-group">
                <label>
                  Stars:
                  </label>
                  <input type="text" name="stars" className="form-control" value={review.stars} onChange={handleChange} required />
                
              </div>
              <br />
              <div className="form-group">
                <label>
                  Title:
                  </label>
                  <input type="text" name="title" className="form-control" value={review.title} onChange={handleChange} required />
              </div>
              <br />
              <div className="form-group">
                <label>
                  What did you think?
                  </label>
                  <textarea type="text" name="textarea" className="form-control"  value={review.textarea} onChange={handleChange} required />

              </div>
              <br />
              {/* <label>
        Restaurant ID:
        <input type="text" name="restaurantID" value={review.restaurantID} onChange={handleChange} />
      </label> */}
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
=======
      {/* Header */}
      <UserDashboard />
      <div className="review-form-container">
        <h1 className="form-title">Write a Review for '{restaurant ? restaurant.restaurantName : 'Loading...'}'</h1>

        <form className="review-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Name:
            <input className="form-input" type="text" name="name" onChange={handleChange} />
          </label>
          <label className="form-label">
            Stars:
            <input className="form-input" type="number" name="stars" onChange={handleChange} />
          </label>
          <label className="form-label">
            Title:
            <input className="form-input" type="text" name="title" onChange={handleChange} />
          </label>
          <label className="form-label">
            Review:
            <textarea className="form-textarea" name="textarea" onChange={handleChange} />
          </label>
          <button className="form-submit-btn" type="submit">Submit Review</button>
        </form>
      </div>
      {/**Footer */}
      <Footer />
>>>>>>> origin/main
    </div>

  );
};

export default ReviewForm;