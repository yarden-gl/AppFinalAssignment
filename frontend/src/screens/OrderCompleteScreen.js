import React from 'react';


function OrderCompleteScreen(props) {

  return <div className = 'orderComplete'> 
   <h1> Thank you for your order! {window.orderId}</h1>
  </div>
}

export default OrderCompleteScreen;

