import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';


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
    </div>

  );
};

export default ReviewForm;