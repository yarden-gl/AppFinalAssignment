import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';

function SigninScreen(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    return () => {
      //
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();


  }
  return <div className="form">
    <form onSubmit={submitHandler} >
      <ul className="form-container">
        <li>
          <h2>Sign-In</h2>
        </li>
        <li>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} required>
          </input>
        </li>
        <li>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required>
          </input>
        </li>
        <li>
          <button type="submit" className="button primary" onClick={
              async () => {
                if(document.getElementById("username").value && document.getElementById("password").value) {
                  await axios.post('/signin', {
                    username: username,
                      password: password
                    }).then((response) => {
                      alert(`Welcome Back, ${username}! Happy shopping!`);
                      window.location = '/homescreen';
                    }, (error) => {
                      alert("Username or password is incorrect, please try again")
                      console.log(error);
                    });
                }
                else {
                  alert("Please insert username and password")
                }   
              }
          }>Signin</button>
        </li>
        <li>
          <Link to="/register" className="button secondary text-center" >SignUp</Link>
        </li>
      </ul>
    </form>
  </div>
}
export default SigninScreen;