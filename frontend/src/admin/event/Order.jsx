
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

const Order = () => {
    const [data, setData] = useState([]);
    // console.log(data)
    useEffect(() => {
        document.title='OrderCheck'
        // updateStatus(); 
        fetchDetails();
    }, []);

    let fetchDetails = async () => {
        try {
            const response = await axios.get("http://localhost:8081/userDetails");
            // console.log(response.data)
            setData(response.data);
            console.log(data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    let updateStatus = async (id, newStatus) => {
        // alert( id)
        // const status=newStatus
        try {
            const confirmed=Swal.fire({
                title: "Are you sure?",
                text: "You Changed Ticket Booking Status",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Click it!"
              })
                if ((await confirmed).isConfirmed) {
                  await axios.patch(`http://localhost:8081/updateStatus/${id}`, { status: newStatus })
                  Swal.fire({
                    title: `${newStatus}!`,
                    text: `Ticket ${newStatus}`,
                    icon: "success"
                  });
                }
                await fetchDetails(); 
                
            } catch (error) {
            alert("Error updating status:", error);
        }
    };

    return (
        <div>
        <div className="dashboard-layout">
        <Header />
        <div className="main-container">
            <Sidebar />
            <div className="content-container">
                <div className="dashboard-container">
                <div>
                <table>
                    <tr>
                        <th>Sl No</th>
                        <th>Username</th>
                        <th>Event name</th>
                        <th>Ticket Type</th>
                        <th>purchase date</th>
                        <th>Oder Quantity</th>
                        <th>ticket price</th>
                        <th>total price</th>
                        <th>status</th>
                    </tr>
                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="9">No data found.</td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.username}</td>
                                <td>{item.event_name}</td>
                                <td>{item.ticket_type}</td>
                                <td>{item.purchase_date}</td>
                                <td>{item.quantity}</td>
                                <td>{item.ticket_price}</td>
                                <td>{item.total_price}</td>
                                <td>
                                    {item.status === 'pending' ? (
                                        <>
                                            <button onClick={() => updateStatus(item.id, 'confirmed')} style={{ background: "green",color:"white" }}>Confirm</button>
                                            <button onClick={() => updateStatus(item.id, 'cancelled')} style={{ background: "red",color:"white" }}>Cancel</button>
                                        </>
                                    ) : (
                                        item.status
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    
                    </tbody>
                </table>
            </div>
                </div>
                
            </div>
        </div>
        <Footer />
    </div>
        </div>
    );
};

export default Order;
