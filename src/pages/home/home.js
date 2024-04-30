import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import './home.css'

var actualPage = 1;
var maxPages = 0;

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

function createPagination(total) {
  const pageItems = [];

  for (let i = 1; i <= total; i++) {
    pageItems.push(
      <li key={"p"+i} className="page-item">
        <span className="page-link">{i}</span>
      </li>
    );
  }
  return (
    <nav aria-label="..." className='m-0'>
      <ul className="pagination pagination-sm">
        { pageItems }
      </ul>
    </nav>
  )
}

const Home = () => {
  const [query, setQuery] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [pagination, setPagination] = useState([])
  const [shipmentData, setShipmentData] = useState({ count: 0, rows: [] });
  const [inputValues, setInputValues] = useState({
    inputDateInit: '',
    inputDateEnd: '',
    inputStatus: ''
  });

  const goToPage = (page,type) => {
    console.log(page);
    if (type === 'next' || type === 'prev' ) {
      if (type === 'next' && page < maxPages) {
        actualPage = page+1
      }
      if(type === 'prev' && actualPage > 1){
        actualPage = page-1
      }
    }

    if (type === 'pag') {
      actualPage = page
    }
    //actualPage = page;
    var offset = (actualPage-1)*10
    console.log(offset);
    return offset
  }
  
  const createListPages = (total) => {
    const items = [];
    maxPages = Math.ceil(total / 10)
    for (let i = 1; i <= maxPages; i++) {
      items.push(
        <li key={'p'+i} className="page-item">
          <span className="page-link" onClick={() => { searchByQuery(goToPage(i,'pag'),'pg') }}>{i}</span>
        </li>
      );
      if (i === 5) {
        items.push(
          <li key={'p'+(i+1)} className="page-item">
            <span className="page-link">...</span>
          </li>
        );
        break;
      }
    } 
    return items;
  }

  const searchByQuery = (offset = 0, search = 'search') =>{
    if (search === 'search') {
      actualPage = 1;
      var offset = 0
    }
    setShipmentData({ count: 0, rows: [] })
    var di = inputValues.inputDateInit ?? ''
    var de = inputValues.inputDateEnd ?? ''
    var stats = inputValues.inputStatus ?? ''
    var where = ''
    if (de !== '') {
      var dateEnd = new Date(de);
      dateEnd.setHours(23, 59, 59, 999);
      de = dateEnd.toISOString();
    }
    if (di == '' && de == '' && stats == '') {
      where = ''
    } else {
      where = `where={${di === "" && de === "" ? "" : `"fulfillmentDate": { ${di !== '' ? `"[gte]": "${di}",` : ""} ${de !== '' ? `"[lte]": "${de}"`: ""}},`} "status": "${stats !== '' ? stats : ''}","markedAs": "OPEN"}&` 
    }
    var newQuery = `${where}limit=10&offset=${offset}&sortBy=fulfillmentDate&sortDir=ASC`
    console.log(newQuery);
    setQuery(newQuery)
    getListShip(newQuery).then(resp=>{
      setTotalRows(resp.count)
      setShipmentData(resp)
      setPagination(createListPages(resp.count))
      console.log(resp.rows);
    }).catch(err=>{
      console.log(err);
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name);
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

  useEffect(() => {
    async function fetchData() {
      const data = await getListShip();
      setPagination(createListPages(data.count))
      setTotalRows(data.count)
      setShipmentData(data);
    }
    fetchData();
  }, []); 
  
  return (
    <div>
      <h2 className='mx-5 mt-3 mb-1 text-center'>SHIPMENT LIST ({totalRows})</h2>
      <div className='container mb-4'>
        <div className='row'>
          <div className='col-lg-4 col-md-12 col-sm-12'>
            <div className='d-grid'>
              <label className='mb-2' htmlFor="start">Start date:</label>
              <input type="date" id="start" name="inputDateInit" onChange={handleChange}/>
            </div>
          </div>
          <div className='col-lg-4 col-md-12 col-sm-12'>
            <div className='d-grid'>
              <label className='mb-2' htmlFor="end">End date:</label>
              <input type="date" id="end" name="inputDateEnd" onChange={handleChange}/>
            </div>
          </div>
          <div className='col-12 col-lg-3'>
            <div className=''>
              <label className='' htmlFor="status-shipment">Estatus:</label>
              <select class="form-select" aria-label="Seleccione" name='inputStatus' onChange={handleChange}>
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
          </div>
          <div className='col-12 d-flex justify-content-start align-items-center pt-3'>
            <button className='btn btn-primary' onClick={searchByQuery}>BUSCAR</button>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center m-0'>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item"><a className="page-link" href="#" onClick={ ()=>{ searchByQuery(goToPage(actualPage,'prev'),'p') } }>Previous</a></li>
            { pagination }
          <li className="page-item"><a className="page-link" href="#" onClick={ ()=>{ searchByQuery(goToPage(actualPage,'next'),'n') } }>Next</a></li>
        </ul>
      </nav>
        
      </div>
      <div className='container container-shiments-list'>
        <div className='row row-cols-lg-3 row-cols-sm-1 row-cols-md-1'>
        {shipmentData.rows.map((shipment) => (
          <div className='col'>
            <div className='card mt-2 mb-3'>
              <div className='card-body'>
                <h5 className='card-title'>Order: {shipment.orderNumber}</h5>
                <p><span style={{ fontWeight:"bold" }}>Estatus: </span> {shipment.status  }</p>
                <div className='container'>
                  <div className='row'>
                    <div className='col ps-0'>
                      <p className='mx-1'><span style={{ fontWeight:"bold" }}>Email:</span> { shipment.customerEmail } </p>
                      <p className='mx-1'><span style={{ fontWeight:"bold" }}>Name:</span> { shipment.customerName } </p>
                      <p className='mx-1'><span style={{ fontWeight:"bold" }}>Courier: </span> { shipment.courier }</p>
                      <p className='mx-1'><span style={{ fontWeight:"bold" }}>Tracking: </span> {shipment.trackingNumber}</p>
                      <p className='mx-1'><span style={{ fontWeight:"bold" }}>FulfillmentDate:</span> { shipment.fulfillmentDate }</p>
                    </div>
                    
                  </div>

                </div>
                
                <div className='d-flex justify-content-end'>
                  <button className='btn btn-primary' onClick={()=> goDetailPage(shipment.courier,shipment.trackingNumber)}>
                    Show Detail
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
      
    </div>
  );
};

export default Home;