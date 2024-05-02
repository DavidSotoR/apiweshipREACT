import axios from 'axios';
import React, { useEffect, useState } from 'react';

async function sendDataGetDetails(courierShip, trackingNumber) {
    var url = 'http://localhost:4000/api/v1/shipment/tracking-number'
    var shipment = {
            courier: courierShip,
            tracking: trackingNumber
        }
    var tk = localStorage.getItem('token')
    if (!tk && tk === '') {
        localStorage.clear()
        window.location.replace('/login')
    }
    
    var config = {
        headers:{
        weship: tk
        }
    }
    var respuesta = await axios.post(url, shipment,config)
    console.log(respuesta.data);
    if (respuesta.data.status === 401) {
        localStorage.clear()
        window.location.replace('/login')
      }
    return respuesta.data.data[0]
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}
const Details = () => {
    const goBack = () => {
        window.location.replace('/')
    }
    const [shipmentDetail, setShipmentDetail] = useState({});
    const [ rowTableDetails, setRowTableDetails ] = useState([])
    const renderFilasTabla = () => {
        return rowTableDetails.map((detail, index) => (
            <tr key={'tr-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{detail.status}</p>
                </td>
                <td>
                    <p>{formatDate(detail.date)}</p>
                            
                </td>
                <td>
                    <p>{detail.scanLocation ?? detail.message}</p>
                </td>
            </tr>
        ));
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const courier = searchParams.get('courier');
        const tracking = searchParams.get('tracking');
        sendDataGetDetails(courier,tracking).then(data=>{
            setRowTableDetails(data.events)
            setShipmentDetail(data);
        }).catch(error => {
            console.error('Error al obtener detalles del envío:', error);
        });
    }, []);
  return (
    <div className='card m-3'>
        <div className='m-3'>
            <button className="btn btn-outline-primary" onClick={ goBack }>
                <img src={`${process.env.PUBLIC_URL}/icon_arrow_back.svg`} alt="Icono" /> Back
            </button>
        </div>
        <div className='card-body'>
            <h4>Shipment Data</h4>
            <p>ID: { JSON.stringify(shipmentDetail.id) }</p>
            <p>Channel: { JSON.stringify(shipmentDetail.channel) } - courier: { JSON.stringify(shipmentDetail.courier) }</p>
            <p>Selected Shipping: {shipmentDetail.customerSelectedShipping}</p>
            <div className='d-grid justify-element-start'>
                <h5>Customer Data:</h5>
                <p>Name: {shipmentDetail.customerName}</p>
                <p>Email: {shipmentDetail.customerEmail}</p>
                <p>Phone: {shipmentDetail.customerPhone}</p>
                <p>Address: {shipmentDetail.customerCity}, {shipmentDetail.customerProvince}, {shipmentDetail.customerCountry}, CP {shipmentDetail.customerZip}</p>
            </div>
            <div className='d-grid justify-element-start'>
                <h5>History Shippment:</h5>
                <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Location</th>
                    </tr>
                </thead>
                <tbody>
                    { renderFilasTabla() }
                </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Details;