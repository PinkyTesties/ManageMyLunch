import e from "express";
import { useState } from "react";

export default function Register() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const registerUser = (e) => {
        e.preventDefault();
        console.log(data);
    }
}

// return (
//     <div>
//         <h1>Register</h1>
//         <form onSubmit={registerUser}>
//             <label>Name</label>
//             <input type="text" placeholder="enter your name" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
//             <label>Email</label>
//             <input type="email" placeholder="enter your email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
//             <label>Password</label>
//             <input type="password" placeholder="enter your password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
//             <label>Confirm Password</label>
//             <input type="password" placeholder="confirm your password" value={data.confirmPassword} onChange={(e) => setData({...data, confirmPassword: e.target.value})} />
//             <button type="submit">Register</button>
//         </form>
//     </div>
// );

// return (

//     <form noValidate onSubmit={onSubmit}>
//       <div className="form-group">
//       <img src={logo} alt='Logo' height={100} />
// <h1>Sign Up to Manage My Lunch</h1>
//       <p>***THIS PAGE STILL REQUIRES CSS. DO NOT SUBMIT AS IS***</p>

//       <label htmlFor="name">Name:</label>
//         <input
//           type="text"
//           placeholder="name"
//           name="name"
//           className="form-control"
//           value={user.name}
//           onChange={onChange}
//         />
//       </div>
//       <br />
//       <div className="form-group">
//       <label htmlFor="email">Email:</label>

//         <input
//           type="text"
//           id="email"
//           placeholder="email"
//           name="email"
//           className="form-control"
//           value={user.email}
//           onChange={onChange}
//         />
//       </div>
//       <br />
//       <div className="form-group">
//       <label htmlFor="password">Password:</label>

//         <input
//           type="password"
//           id="password"
//           //placeholder=""
//           name="password"
//           className="form-control"
//           value={user.password}
//           onChange={onChange}
//         />
//       </div>
//       <br />
//       <div className="form-group">
//       <label htmlFor="confirmpassword">Confirm Password:</label>

//         <input
//           type="password"
//           id="password"
//           //placeholder=""
//           name="confirmpassword"
//           className="form-control"
//           //value={user.password}
//           onChange={onChange}
//         />
//       </div>
//       <br />
//       <div className="form-group">
//       {/* <label htmlFor="date_added">Date:</label>

//         <input
//           type="date"
//           id="date"
//           placeholder=""
//           name="date_added"
//           className="form-control"
//           value={user.date_added}
//           onChange={onChange}
//         /> */}
//       </div>
//       <br />
//       <div className="form-group">
//       <label htmlFor="university">University:</label>

//         <input
//           type="text"
//           id="University"
//           placeholder="University"
//           name="university"
//           className="form-control"
//           value={user.university}
//           onChange={onChange}
//         />
//       </div>
//       <div className="form-group">
//       {/* <label htmlFor="updated_date">Updated Date:</label>
//         <input
//           type="date"
//           id="updated_date"
//           placeholder=""
//           name="updated_date"
//           className="form-control"
//           value={user.updated_date}
//           onChange={onChange}
//         /> */}
//       </div>
//       <button type="submit" className="btn btn-primary">
//   Sign Up
// </button>
// Already have an account? <Link to="/" className="btn btn-link">Login</Link>
// <br></br><br></br>
// <button>Sign up as driver</button>
// </form>


// );
// };

// export default SignUp;