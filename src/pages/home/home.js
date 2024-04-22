import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

async function getListShip (query = '') {
  var url = 'http://localhost:4000/api/v1/shipment/list'
  var tk = localStorage.getItem('token')
  var ALLSHIPMENT
  if (!tk && tk === '') {
      localStorage.clear()
      window.location.replace('/login')
  }

  var config = {
    headers:{
      weship: tk,
      query:query
    }
  }
  try {
    var resp = await axios.get(url,config)
    console.log(resp.data.rows);
    if (resp.data.status === 401) {
      localStorage.clear()
      window.location.replace('/login')
    }

     ALLSHIPMENT = resp.data 
    return ALLSHIPMENT
  } catch (error) {
     ALLSHIPMENT = {
      count: 0,
      rows: []
    }
    return ALLSHIPMENT
  }
}

function goDetailPage(courierShip,trackingNumber) {
  window.location.replace(`/details?courier=${courierShip}&tracking=${trackingNumber}`)
}

function changeDateFormat (dateText) {
  var newFormat
  try {
    const [year, month, day] = dateText.split('-');
    const newDate = new Date(year, month - 1, day);
    newFormat = format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  } catch (error) {
    newFormat = ''
  }
  
  return newFormat
}

const Home = () => {
  const [query, setQuery] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [inputValues, setInputValues] = useState({
    inputDateInit: '',
    inputDateEnd: '',
    inputStatus: ''
  });

  const searchByQuery = () =>{
    setShipmentData({ count: 0, rows: [] })
    var di = inputValues.inputDateInit ?? ''
    var de = inputValues.inputDateEnd ?? ''
    var stats = inputValues.inputStatus ?? ''
    var newQuery = `where={${di === "" && de === "" ? "" : `"fulfillmentDate": { ${di !== '' ? `"[gte]": "${di}",` : ""} ${de !== '' ? `"[lte]": "${de}"`: ""}},`} "status": "${stats !== '' ? stats : ''}","markedAs": "OPEN"}&limit=10&offset=0&sortBy=fulfillmentDate&sortDir=ASC`
    setQuery(newQuery)
    getListShip(newQuery).then(resp=>{
      console.log(resp);
      setTotalRows(resp.count)
      setShipmentData(resp)
    }).catch(err=>{
      console.log(err);
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'inputDateInit' || name === 'inputDateEnd' ) {
      console.log(value);
      setInputValues({
        ...inputValues,
        [name]: changeDateFormat(value)
      });
    } else {
      setInputValues({
        ...inputValues,
        [name]: value
      });
    }
    
  };

  const [shipmentData, setShipmentData] = useState({ count: 0, rows: [] });

  useEffect(() => {
    async function fetchData() {
      const data = await getListShip();
      setTotalRows(data.count)
      setShipmentData(data);
    }
    fetchData();
  }, []); 
  
  return (
    <div>
      <h1>SHIPMENT LIST ({totalRows})</h1>
      QUERY = { query }
      <div className='m-3 d-flex'>
        <div className='d-grid'>
          <label for="start">Start date:</label>
          <input type="date" id="start" name="inputDateInit" onChange={handleChange}/>
        </div>
        <div className='mx-2 d-grid'>
          <label for="end">End date:</label>
          <input type="date" id="end" name="inputDateEnd" onChange={handleChange}/>
        </div>
        <div className='mx-2 d-grid'>
        <label className='mb-3' for="status-shipment">Estatus:</label>
          <select className="custom-select custom-select-lg mb-3" name='inputStatus' onChange={handleChange}>
            <option selected>Select Status</option>
            <option value="Label created">Label created</option>
            <option value="Picked up">Picked up</option>
            <option value="In transit">In transit</option>
            <option value="Delayed">Delayed</option>
            <option value="Delivered">Delivered</option>
            <option value="Exception">Exception</option>
            <option value="Label canceled">Label canceled</option>
          </select>
        </div>
        <div className='mt-4'>
          <button className='btn btn-primary' onClick={searchByQuery}>BUSCAR</button>
        </div>
      </div>
      
      {shipmentData.rows.map((shipment, index) => (
          <div className='card m-2'>
            <div className='card-body'>
              <h5 className='card-title'>Order: {shipment.orderNumber}</h5>
              <p>Estatus: {shipment.status  }</p>
              <p> Email: { shipment.customerEmail } </p>
              <p> Name: { shipment.customerName } </p>
              <p>Courier: { shipment.courier } - tracking: {shipment.trackingNumber}</p>
              <p>fulfillmentDate: { shipment.fulfillmentDate }</p>
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