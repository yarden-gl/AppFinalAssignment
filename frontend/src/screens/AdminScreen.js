import React, {useEffect,useState} from 'react';
import axios from 'axios';


function AdminScreen(props) {
let keys = [];
let values = [];
  const [adminLogs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
     // const { data } = await axios.get("/adminpanel");
     // const { data } = await axios.get("/allusers");
      //setLogs(data);
      //setLogs([{"100":"logged in","200":"check out","user":"dave"},{"100":"logged in","200":"check out","user":"yarden"}]);
      setLogs([{"100":"logged in","200":"check out"},{"100":"logged in","200":"check out"}]);
     setUsers(["admin","Joe","Yarden","Dave"]);
    }
    fetchData();
    return () => {};
  },[]);
  adminLogs.forEach((userLog) => {
    //console.log(userLog);
    keys = Object.keys(userLog);
    values = [Object.values(userLog)];
   // console.log(keys);
    //console.log(values);
    }); 
  return <div className = 'adminScreen'> 

<select name="users" id="users" onChange = { async (e) => {
  await axios.get(`/adminpanel/${e}`);
  let input = document.getElementById('adminfilter');
                //await axios.get(`/adminfilter`);
}

}>
<option value="" disabled selected hidden>Choose user...</option>
  {users.map((user) =>

<option value="username">{user}</option>


  )}
 
</select>
    
    <div >
      <table className = "admin-panel-table">
        <tbody>

        { adminLogs.map((userLog) => 
         <tr key={userLog.user}>
          <td className="admin-panel-table-elements"><div>{userLog.user}</div></td>
          { (keys).map((element) => 
          <td className="admin-panel-table-elements"><div>{element}</div></td>  
          )}
          </tr>
        )}
        </tbody>
   </table>
  </div>
</div>
}

export default AdminScreen;

/**
 * <table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
  <tr>
    <td>Ernst Handel</td>
    <td>Roland Mendel</td>
    <td>Austria</td>
  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>
    <td>UK</td>
  </tr>
  <tr>
    <td>Laughing Bacchus Winecellars</td>
    <td>Yoshi Tannamuri</td>
    <td>Canada</td>
  </tr>
  <tr>
    <td>Magazzini Alimentari Riuniti</td>
    <td>Giovanni Rovelli</td>
    <td>Italy</td>
  </tr>
</table>

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