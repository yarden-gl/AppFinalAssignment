import React, {useEffect,useState} from 'react';
import axios from 'axios';


function AdminScreen(props) {

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/logs");
      setLogs(data);
    }
    fetchData();
    return () => {};
  },[]);

  return <div className = 'adminScreen'> 
   <input className="searchBar" type="text" placeholder="Search.." id="search"></input>
            <button type="submit" className="searchButton" onClick = { 
              async () => {
                let input = document.getElementById('search');
                window.arr = await axios.get(`/api/search/${input.value}`);
              }
            }><span role="img" aria-label="magnifyingglass">🔍</span></button>
  <div className = "table">
   <table>
     <tr>

     </tr>
   </table>
  </div>
</div>
}

export default AdminScreen;

