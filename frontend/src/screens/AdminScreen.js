import React, {useEffect,useState} from 'react';
//import axios from 'axios';


function AdminScreen(props) {

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
     // const { data } = await axios.get("/adminpanel");
      //setLogs(data);
      setLogs([{"100":"logged in","200":"check out","user":"dave"},{"100":"logged in","200":"check out","user":"yarden"}]);
    }
    fetchData();
    return () => {};
  },[]);
//let userName = userLog.splice(userLog.length - 1);
  return logs ? <div className = 'adminScreen'> 
   <input className="searchBar" type="text" placeholder="Search.." id="search"></input>
            <button type="submit" className="searchButton" onClick = { 
              async () => {
                let input = document.getElementById('adminfilter');
                //await axios.get(`/adminfilter`);
              }
            }><span role="img" aria-label="magnifyingglass">🔍</span></button>
  <div className = "table">
   <table>
      { 
       logs.forEach((userLog) => 


         userLog.map((element) => <tr>
             <td>userLog</td>
           </tr>
         )
           )
          }
   </table>
  </div>
</div>

: "No logs to display"
}

export default AdminScreen;

