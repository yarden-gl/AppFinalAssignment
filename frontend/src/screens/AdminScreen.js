import React, {useEffect,useState} from 'react';
import axios from 'axios';


function AdminScreen(props) {
  
  
  const [actions,setActions] = useState([]);
  const [users, setUsers] = useState([]);
  const[user,setUser] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axios.get("/allusers").then((response)=> {
        setUsers(response.data);
      },(error)=>{
        console.log(error);
      });
    } 
    fetchData();
    return () => {};
  },[user]);

  return <div>
    <label>Users:</label>
    <select id="users">
        {users?.map((user) =>
        <option key={user} disabled>{user}</option>
        )}
    </select>

<input type="text" id="search"  onChange={(e) => setUser(e.target.value)} required>
            </input>
            <button type="submit" className="searchButton" onClick = { 
              async () => {
                  await axios.get(`/userlog/${user}`).then((response)=>{
                  setActions(Object.values(response.data));
                },
                  (error)=>
                  alert(error)
                );
              }
            }><span role="img" aria-label="magnifyingglass">🔍</span></button>
<table >
  <tbody>
  {actions?.map((action,index) => 
        <tr key={action} >{action}</tr>
      )}
  </tbody>
</table>
</div>
}

export default AdminScreen;
