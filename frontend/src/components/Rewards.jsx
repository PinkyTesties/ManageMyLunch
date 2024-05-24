import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDashboard from './UserDashboard';
import '../style/Rewards.css';
import Footer from '../components/sharedComponents/Footer';

function Rewards() {
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');
    const [dollarValue, setDollarValue] = useState('');
    const [message, setMessage] = useState('');
    const [code, setCode] = useState('');
    const [rewardType, setRewardType] = useState('');
    const [rewardStatus, setRewardStatus] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    const [rewards, setRewards] = useState([]);
    const [newStatus, setNewStatus] = useState({});
    const [isDropdownUsed, setIsDropdownUsed] = useState({});

    const handleStatusChange = (id, e) => {
        setNewStatus(prevStatus => ({ ...prevStatus, [id]: e.target.value }));
        setIsDropdownUsed(prevUsed => ({ ...prevUsed, [id]: true }));
    };

    const handleConfirmClick = async (id) => {
        if (newStatus[id]) {
            // Ask the user for confirmation before proceeding
            if (window.confirm('Are you sure you want to update the status of this reward?')) {
                try {
                    const response = await axios.put(`http://localhost:8082/api/rewards/update/${id}`, {
                        rewardStatus: newStatus[id]
                    });
    
                    if (response.status === 200) {
                        console.log(`Updated status of reward ${id} to ${newStatus[id]}`);
                        // Update the local state to reflect the change
                        setRewards(rewards.map(reward => reward._id === id ? { ...reward, rewardStatus: newStatus[id] } : reward));
                        // Hide the confirm button
                        setIsDropdownUsed(prevUsed => ({ ...prevUsed, [id]: false }));
                    } else {
                        console.error('Failed to update reward status');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            console.error('No new status selected for this reward');
        }
    };

    useEffect(() => {
        fetchRewards(rewardStatus);
    }, [rewardStatus]);

    const fetchRewards = async (status) => {
        try {
            const response = await axios.get(`http://localhost:8082/api/rewards/filter?status=${status}`);
            setRewards(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(error);
            setRewards([]); // Set rewards to an empty array in case of error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reward = {
            title,
            points,
            dollarValue,
            message,
            code,
            rewardType,
            rewardStatus
        };

        const response = await fetch('http://localhost:8082/api/rewards/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reward),
        });

        if (response.ok) {
            console.log('Reward created successfully');
        } else {
            console.log('Error creating reward');
            alert('Reward creation failed. Please check that your inputs are valid.');
        }
        // Clear the form when the reward is created
        setMessage('');
        setCode('');
        setRewardStatus('');
        setPoints('');
        setTitle('');
        setDollarValue('');
        setRewardType('');

    }

    return (
        <div>
            <div className='mainContainer'>
                <UserDashboard /> {/* Use UserDashboard */}

                <div className='createReward'>
                    <h1>Create a Reward</h1>
                    <form onSubmit={handleSubmit}>



                        <div className='disclaimer'>
                            <p>Note:
                                <br></br>  - Menu Item Discount will only subtract from the cart, the delivery fee will remain the same.
                                <br></br>  - Delivery Discount will subtract from the delivery fee, and Free Delivery will set the delivery fee to 0.
                                <br></br> - The carts balance will never go below 0, if the discount is greater than the cart balance, the cart balance will be set to 0.

                            </p>
                        </div>

                        <label>
                            Reward Type:
                            <select value={rewardType} onChange={e => setRewardType(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="Delivery Discount">Delivery Discount</option>
                                <option value="Free Delivery">Free Delivery</option>
                                <option value="Menu Item Discount">Menu Item Discount</option>
                            </select>
                        </label>
                        <br></br>

                        {rewardType !== 'Free Delivery' && (
                            <label>
                                Dollar Value:
                                <input type="number" value={dollarValue} onChange={e => setDollarValue(e.target.value)} />
                            </label>
                        )}
                        <br></br>
                        <label>
                            Title:
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </label>
                        <br></br>

                        <label>
                            Points Required:
                            <input type="number" value={points} onChange={e => setPoints(e.target.value)} />
                        </label>
                        <br></br>



                        <label>
                            Message:
                            <textarea value={message} onChange={e => setMessage(e.target.value)} />
                        </label>
                        <br></br>

                        <label>
                            Unique Code:
                            <input type="text" value={code} onChange={e => setCode(e.target.value)} />
                        </label>
                        <br></br>

                        <label>
                            Reward Status on Creation:
                            <select value={rewardStatus} onChange={e => setRewardStatus(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="Active">Active</option>
                                <option value="Paused">Paused</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </label>
                        <br></br>
                        <br></br>
                        <br></br>



                        <input type="submit" value="Create Reward" />
                    </form>

                <hr></hr>

                <div className='existingRewards'>
                <h1>Existing Rewards</h1>

                <label>
                    Filter by status:
                    <select value={rewardStatus} onChange={e => setRewardStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </label>
                {rewards.length === 0 ? (
                    <p>No Results</p>
                ) : (rewards.map(reward => (
                    <div key={reward._id} className="reward-box-rewardPage">
                        <h2>{reward.title}</h2>
                        <p>Status: {reward.rewardStatus}<br></br>
                            Points: {reward.points}<br></br>
                            Dollar Value: {reward.dollarValue}<br></br>
                            Message: {reward.message}<br></br>
                            Code: {reward.code}<br></br>
                            Reward Type: {reward.deliveryDiscount ? 'Delivery Discount' : reward.freeDelivery ? 'Free Delivery' : reward.menuItemDiscount ? 'Menu Item Discount' : 'Not specified'}<br></br>
                        </p>
                        Change Status:
                        <select value={newStatus[reward._id] || ''} onChange={e => handleStatusChange(reward._id, e)}>
                            <option value="">Select a status</option>
                            <option value="Active">Active</option>
                            <option value="Paused">Paused</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        {isDropdownUsed[reward._id] && <button onClick={() => handleConfirmClick(reward._id)}>Confirm</button>}
                    </div>
                )))}
                </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}

export default Rewards;