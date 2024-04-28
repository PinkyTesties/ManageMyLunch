import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const ReviewForm = () => {
  const { id } = useParams(); // Get the restaurant ID from the URL
  const navigate = useNavigate();

  const [review, setReview] = useState({
    name: '',
    stars: '',
    title: '',
    textarea: '',
    restaurantID: id // Set the restaurant ID to the one from the URL
  });
  const [restaurant, setRestaurant] = useState(null);

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
  useEffect(() => {
    setReview(prevReview => ({ ...prevReview, restaurantID: id }));
  }, [id]);

  const handleChange = e => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/reviewForm', review);
      alert('Review submitted successfully');
      navigate('/OrderStatus');
      setReview({
        name: '',
        stars: '',
        title: '',
        textarea: '',
        restaurantID: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Review Form</h2>
      <p>Restaurant Name: {restaurant ? restaurant.restaurantName : 'Loading...'}</p>
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

export default ReviewForm;