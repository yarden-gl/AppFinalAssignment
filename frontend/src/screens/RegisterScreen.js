import React, { useEffect, useState } from 'react';
import axios from 'axios';



function RegisterScreen(props) {

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
          <h2>Create Account</h2>
        </li>
        <li>
          <label htmlFor="username">
          Username
          </label>
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
                  await axios.post('/register', {
                    username: username,
                      password: password
                    }).then((response) => {
                      alert(`Thanks for registering, ${username}! Please sign in:)`);
                      window.location = '/homescreen';
                    }, (error) => {
                      alert(error);
                      console.log(error);
                    });
                }
                else {
                  alert("Please insert username and password")
                }   
              }
          }>Register</button>
        </li>

      </ul>
    </form>
  </div>
}
export default RegisterScreen;