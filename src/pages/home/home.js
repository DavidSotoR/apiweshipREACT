import axios from 'axios';
import React, { useEffect, useState } from 'react';

async function getListShip () {
  var url = 'http://localhost:4000/api/v1/shipment/list'
  try {
    var resp = await axios.get(url)
    console.log(resp);

    var ALLSHIPMENT = resp.data 
    return ALLSHIPMENT
  } catch (error) {
    var ALLSHIPMENT = {
      count: 0,
      rows: []
    }
    return ALLSHIPMENT
  }
}

function goDetailPage(courierShip,trackingNumber) {
  window.location.replace(`/details?courier=${courierShip}&tracking=${trackingNumber}`)
}

// Definición del componente Funcional
const Home = () => {
  const [shipmentData, setShipmentData] = useState({ count: 0, rows: [] });
  useEffect(() => {
    async function fetchData() {
      const data = await getListShip();
      setShipmentData(data); // Almacena los datos en el estado del componente
    }
    fetchData();
  }, []); 
  
  return (
    <div>
      <h1>SHIPMENT LIST</h1>
      
      {shipmentData.rows.map((shipment, index) => (
          <div className='card m-2'>
            <div className='card-body'>
              <h5 className='card-title'>Order: {shipment.orderNumber}</h5>
              <p>Estatus: {shipment.status  }</p>
              <p> Email: { shipment.customerEmail } </p>
              <p> Name: { shipment.customerName } </p>
              <p>Courier: { shipment.courier } - tracking: {shipment.trackingNumber}</p>
              <div className='d-flex justify-content-end'>
                <button className='btn btn-primary' onClick={()=> goDetailPage(shipment.courier,shipment.trackingNumber)}>
                  Show Detail
                </button>
              </div>
              
            </div>
          </div>
        ))}
    </div>
  );
};

export default Home;