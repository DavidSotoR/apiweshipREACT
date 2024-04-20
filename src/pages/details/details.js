import axios from 'axios';
import React, { useEffect, useState } from 'react';

async function sendDataGetDetails(courierShip, trackingNumber) {
    var url = 'http://localhost:4000/api/v1/shipment/tracking-number'
    var shipment = {
            courier: courierShip,
            tracking: trackingNumber
        }
    var respuesta = await axios.post(url, shipment)
    console.log(respuesta.data.data[0]);
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
    const [shipmentDetail, setShipmentDetail] = useState({});
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const courier = searchParams.get('courier');
        const tracking = searchParams.get('tracking');
        sendDataGetDetails(courier,tracking).then(data=>{
            setShipmentDetail(data);
        }).catch(error => {
            console.error('Error al obtener detalles del envío:', error);
        });
    }, []);
  return (
    <div className='card m-3'>
        <div className='card-body'>
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
                <ul>
                {shipmentDetail.events && shipmentDetail.events.length > 0 ? (
                    shipmentDetail.events.map((event, index) => (
                        <li key={index}>
                            <p>Status: {event.status}</p>
                            <p>Date: {formatDate(event.date)}</p>
                            <p>Location: {event.scanLocation ?? event.message}</p>
                        </li>
                    ))
                ) : (
                    <li>No hay eventos disponibles</li>
                )}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default Details;