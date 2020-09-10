import React from 'react';
import { Link} from 'react-router-dom';
function ReadMe(props) {

  return <div>
  <div className="back-to-result">
  <Link to="/">Back</Link>
</div>
<table class="steelBlueCols">
<thead>
<tr>
<th>head1</th>
<th>head2</th>
</tr>
</thead>
<tbody>
<tr>
<td>cell1_1</td>
<td>cell2_1</td>
</tr>
<tr>
<td>cell1_2</td>
<td>cell2_2</td>
</tr>
<tr>
<td>cell1_3</td>
<td>cell2_3</td>
</tr>
<tr>
<td>cell1_4</td>
<td>cell2_4</td>
</tr>
<tr>
<td>cell1_5</td>
<td>cell2_5</td>
</tr>
<tr>
<td>cell1_6</td>
<td>cell2_6</td>
</tr>
<tr>
<td>cell1_7</td>
<td>cell2_7</td>
</tr>
<tr>
<td>cell1_8</td>
<td>cell2_8</td>
</tr>
</tbody>
</table>
</div>
}

export default ReadMe;

