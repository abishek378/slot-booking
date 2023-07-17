import React,{useState,useEffect} from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import axios from 'axios';
import Modal from 'react-modal';
import "./Calendar.css"
import "./Home.css"


const Home = () => {

    

    const current = moment(new Date()).format('YYYY-MM-DD');
    // console.log(current);
    const [date, setDate] = useState(current);
    const [getall, setGetall] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
  

    const timeSlots = [
        { id: 1, date: date, timing: '10:00 AM - 11:00 AM' },
        { id: 2, date: date, timing: '11:00 AM - 12:00 PM' },
        { id: 3, date: date, timing: '12:00 PM - 1:00 PM' },
        { id: 4, date: date, timing: '3:00 PM - 4:00 PM' },
        { id: 5, date: date, timing: '4:00 PM - 5:00 PM' },
      ];

    useEffect(() => {
        getalldata();
      }, [getall]);


  //getall method  
  const getalldata = async () => {
    try {
      const response = await axios.get('http://localhost:7773/');
      const data = response.data;
      setGetall(data);
    } catch (error) {
      console.error('Error getting data:', error);
    }
  };
//   console.log('getalldata', getall);

    const handleChange = (date) => {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        const previousDate = new Date(currentDate);
        previousDate.setDate(previousDate.getDate() - 1); // To subtract 1 day from the current date
    
        if (selectedDate <= previousDate) {
          alert('Past dates are not allowed.');
        } else if (selectedDate.getDay() === 5) {
          // 5 represents Friday 
          alert('Fridays are Holiday. Please choose another date.');
        } else {
          const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
          setDate(formattedDate);
        //   console.log('formattedDate', formattedDate);
        }
      };

      const isSlotBooked = (slot) => {
        return getall.some(
          (booking) =>
            booking.date === slot.date && booking.timing === slot.timing
        );
      };
    

      const handleClick = (slot) => {
        if (isSlotBooked(slot)) {
          return; // If the slot is already booked, do nothing
        } else {
          setSelectedSlot(slot);
          setIsModalOpen(true);
        }
      };


      //modal functions


      const handleCloseModal = () => {
        setIsModalOpen(false);
        setUserName('');
        setPhoneNumber('');
        setEmail('');
      };



      const isDuplicate =(newBooked) => {
        return getall.some(
          (user) =>
            user.email === newBooked.email &&
            user.date === newBooked.date
        );
      };

      const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        const newBooked = {
          name: userName,
          phoneNumber: phoneNumber,
          email: email,
          date: selectedSlot.date,
          timing: selectedSlot.timing,
        };


  const phoneNumberPattern = /^\d{10}$/; // 10-digit phone number format

  if (!phoneNumber.match(phoneNumberPattern)) {
    alert('Please enter a 10-digit number.');
    setPhoneNumber('');
    document.getElementById('phoneNumber').focus(); 
    return;
  }
  
  
        try {
          const duplicate= isDuplicate(newBooked)
// console.log(duplicate)

          if (duplicate) {
            console.log("duplicate");
            alert('This email already exists.');
            setUserName('');
            setPhoneNumber('');
            setEmail('');
            return;
          } else {
            const response = await axios.post('http://localhost:7773/post', newBooked);
            console.log(response.data);
            getalldata();
          }
    }
         catch (error) {
          console.error(error);
        }
    
        handleCloseModal();
        alert("Your Slot Booked Successfully")
      };

  return (
    <div id="main">
         <Calendar onChange={handleChange} value={new Date(date)} id="cal" />


         <div id="slots">
        {date !== null ? (
          <div id="slot_box">
            <h2>Selected Date: {moment(date).format('DD-MM-YYYY')}</h2>

            {timeSlots.map((slot) => (
              <div key={slot.id}>
                <button
                  className='btn'
                  onClick={() => handleClick(slot)}
                  disabled={isSlotBooked(slot)}
                >
                  <div className="time-slot-time">{slot.timing}</div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} id="modal">
        {selectedSlot && (
          <div>
            <h2>Selected Time Slot</h2>
            <p>Date: {selectedSlot.date}</p>
            <p>Timing: {selectedSlot.timing}</p>

            <form onSubmit={handleFormSubmit} id="form">
              <label htmlFor="userName">Name:</label>
              <input
                required
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                required
                type="number"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <label htmlFor="email">Email:</label>
              <input
                required
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button type="submit">Submit</button>
              <button onClick={handleCloseModal}>Close</button>
            </form>
          </div>
        )}
      </Modal>
      

    </div>
  )
}

export default Home