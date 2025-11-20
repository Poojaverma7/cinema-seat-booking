🎬 Cinema Seat Booking System (React + Tailwind CSS):
A modern and interactive Cinema Seat Booking System built with React and Tailwind CSS, featuring a clean Airbnb-style UI. Fully customizable seat layout, pricing, aisle configuration, dynamic seat selection, booking summary, and responsive design.

🚀 Features-
🎨 Airbnb-style clean UI
🪑 Dynamic rows, columns & aisle positions
🎟️ Different seat types & prices (Regular / Premium / VIP)
🔄 Real-time seat selection & smooth animations
🔒 Booked seat handling
📱 Fully responsive layout
💰 Live total price calculation
🧩 Highly customizable & embeddable component
✔️ Success booking popup

📦 Installation
git clone https://github.com/Poojaverma7/cinema-seat-booking.git
cd cinema-seat-booking
npm install
npm start

🧠 Usage

Import the component and use it anywhere:
import CinemaSeatBooking from "./components/CinemaSeatBooking";
function App() {
  return <CinemaSeatBooking />;
}
export default App;

⚙️ Props & Customization
1. Layout
layout={{
  rows: 8,
  seatPerRow: 12,
  aislePosition: [5, 9]
}}

2. Seat Types
seatTypes={{
  regular: { name: "Regular", price: 150, rows: [0,1,2] },
  premium: { name: "Premium", price: 250, rows: [3,4,5] },
  vip: { name: "VIP", price: 350, rows: [6,7] }
}}

3. Pre-booked Seats
bookedSeats={["A3", "C5", "F10"]}

4. Callback
onBookingComplete={({ seats, totalPrice }) => {
  console.log("Booked:", seats, "Total:", totalPrice);
}}

🌐 Live Demo 


🛠️ Tech Stack

React.js
Tailwind CSS
JavaScript (ES6+)
