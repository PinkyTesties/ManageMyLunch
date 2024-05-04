import React, { useState } from 'react';


function Rewards() {
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');
    const [dollarValue, setDollarValue] = useState('');
    const [message, setMessage] = useState('');
    const [code, setCode] = useState('');
    const [rewardType, setRewardType] = useState('');
    const [rewardStatus, setRewardStatus] = useState('');

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
        }
    }

    return (
        <div>
            <h1>Create a Reward</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                </label>
                <label>
                    Points Required:
                    <input type="number" value={points} onChange={e => setPoints(e.target.value)} />
                </label>
                <label>
                    Dollar Value:
                    <input type="number" value={dollarValue} onChange={e => setDollarValue(e.target.value)} />
                </label>
                <label>
                    Message:
                    <textarea value={message} onChange={e => setMessage(e.target.value)} />
                </label>
                <label>
                    Unique Code:
                    <input type="text" value={code} onChange={e => setCode(e.target.value)} />
                </label>
                <label>
                    Reward Type:
                    <select value={rewardType} onChange={e => setRewardType(e.target.value)}>
                        <option value="">Select...</option>
                        <option value="Delivery Discount">Delivery Discount</option>
                        <option value="Free Delivery">Free Delivery</option>
                        <option value="Menu Item Discount">Menu Item Discount</option>
                    </select>
                </label>
                <label>
                    Reward Status on Creation:
                    <select value={rewardStatus} onChange={e => setRewardStatus(e.target.value)}>
                        <option value="">Select...</option>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </label>
                <input type="submit" value="Create Reward" />
            </form>
        </div>
    );
}

export default Rewards;