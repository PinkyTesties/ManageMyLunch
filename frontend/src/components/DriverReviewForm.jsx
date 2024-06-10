import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const DriverReviewForm = () => {
  const { email } = useParams(); // Get the driver email from the URL
  const navigate = useNavigate();

  const [review, setReview] = useState({
    name: '',
    stars: '',
    title: '',
    textarea: '',
    driver_email: email // Set the restaurant ID to the one from the URL
  });
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/drivers/email/${email}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurant();
  }, [email]);
  useEffect(() => {
    setReview(prevReview => ({ ...prevReview, driver_email: email }));
  }, [email]);

  const handleChange = e => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/DriverReviewForm', review);
      alert('Review submitted successfully');
      navigate('/OrderStatus');
      setReview({
        name: '',
        stars: '',
        title: '',
        textarea: '',
        driver_email: ''
      });
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Driver Review Form</h2>
      <p>Driver Name: {restaurant ? email : 'Loading...'}</p>
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={review.name} onChange={handleChange} required />
      </label>
      <label>
        Stars:
        <input type="text" name="stars" value={review.stars} onChange={handleChange} required />
      </label>
      <label>
        Title:
        <input type="text" name="title" value={review.title} onChange={handleChange} required/>
      </label>
      <label>
        Textarea:
        <input type="text" name="textarea" value={review.textarea} onChange={handleChange} required/>
      </label>
      {/* <label>
        Restaurant ID:
        <input type="text" name="restaurantID" value={review.restaurantID} onChange={handleChange} />
      </label> */}
      <button type="submit">Submit Review</button>
    </form>
    </div>

  );
};

export default DriverReviewForm;