import React, {useEffect,useState} from 'react';
import axios from 'axios';


function AdminScreen(props) {
let keys = [];
let values = [];
  
  const [users, setUsers] = useState([]);
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
  },[]);
  /**
   * adminLogs.forEach((userLog) => {
    //console.log(userLog);
    keys = Object.keys(userLog);
    values = [Object.values(userLog)];  
   // console.log(keys);
    //console.log(values);
    }); 
   */
  


  return <div className = 'adminScreen'>
    <select name="users" id="users" onChange = { async (e) => {
      await axios.get(`/userlog/${e}`).then((response)=>console.log(response,
        (error)=> alert(error)));
      }}>
      <option value="" disabled selected hidden>Choose user...</option>
        {users?.map((user) =>
        <option value="username">{user}</option>
        )}
    </select>
    
    <div >
      <table className = "admin-panel-table">
        <tbody>

        
        </tbody>
   </table>
  </div>
</div>
}

export default AdminScreen;

/**
 * { adminLogs.map((userLog) => 
         <tr key={userLog.user}>
          <td className="admin-panel-table-elements"><div>{userLog.user}</div></td>
          { (keys).map((element) => 
          <td className="admin-panel-table-elements"><div>{element}</div></td>  
          )}
          </tr>
        )}

 * 
 * 
 * 





 logs ? 

: "No logs to display"
 * userLog.map((element) => <tr>
             <td>userLog</td>
           </tr>
         )
 */