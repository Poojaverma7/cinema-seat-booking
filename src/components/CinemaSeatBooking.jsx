import React, { useMemo, useState } from "react";

const CinemaSeatBooking = ({
  layout = {
    rows: 8,
    seatPerRow: 12,
    aislePosition: 5,
  },
  seatTypes = {
    regular: { name: "Regular", price: 150, rows: [0, 1, 2] },
    premium: { name: "Premium", price: 250, rows: [3, 4, 5] },
    vip: { name: "VIP", price: 350, rows: [6, 7] },
  },
  bookedSeats = [],
  currency = "₹",
  onBookingComplete = () => {},
  title = "Cinema Hall Booking",
  subtitle = "Select your preferred seats",
}) => {
  const colors = ["blue", "purple", "yellow", "green", "red", "indigo"];

  const [showSuccess, setShowSuccess] = useState(false);

  // Find the type & color for a row
  const getSeatType = (row) => {
    const arr = Object.entries(seatTypes);
    for (let i = 0; i < arr.length; i++) {
      const [t, conf] = arr[i];
      if (conf.rows.includes(row)) return { type: t, color: colors[i], ...conf };
    }
    const [f, conf] = arr[0];
    return { type: f, color: colors[0], ...conf };
  };

  // Build Seat Map
  const initializeSeats = useMemo(() => {
    const seats = [];
    for (let row = 0; row < layout.rows; row++) {
      const seatRow = [];
      const st = getSeatType(row);
      for (let seat = 0; seat < layout.seatPerRow; seat++) {
        const id = `${String.fromCharCode(65 + row)}${seat + 1}`;
        seatRow.push({
          id,
          row,
          seat,
          type: st.type,
          price: st.price,
          color: st.color,
          status: bookedSeats.includes(id) ? "booked" : "available",
          selected: false,
        });
      }
      seats.push(seatRow);
    }
    return seats;
  }, [layout, seatTypes, bookedSeats]);

  const [seats, setSeats] = useState(initializeSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const colorMap = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    green: "bg-green-100 text-green-700 border-green-300",
    red: "bg-red-100 text-red-700 border-red-300",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
  };

  const getSeatClass = (seat) => {
    const base =
      "w-9 h-9 mx-1 rounded-lg border text-xs flex items-center justify-center transition-all select-none";

    if (seat.status === "booked")
      return `${base} bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed`;

    if (seat.selected)
      return `${base} bg-indigo-600 text-white border-indigo-700 shadow-md scale-105`;

    return `${base} ${colorMap[seat.color]} hover:bg-gray-200 hover:border-gray-400 cursor-pointer`;
  };

  const handleSeatClick = (r, s) => {
    const seat = seats[r][s];
    if (seat.status === "booked") return;

    const already = seat.selected;

    setSeats((prev) =>
      prev.map((row, ri) =>
        row.map((seat, si) =>
          ri === r && si === s ? { ...seat, selected: !seat.selected } : seat
        )
      )
    );

    if (already)
      setSelectedSeats((p) => p.filter((x) => x.id !== seat.id));
    else setSelectedSeats((p) => [...p, seat]);
  };

  const aislePositions = Array.isArray(layout.aislePosition)
    ? layout.aislePosition
    : [layout.aislePosition];

  const renderSection = (row, start, end) => (
    <div className="flex">
      {row.slice(start, end).map((seat, idx) => (
        <div
          key={seat.id}
          className={getSeatClass(seat)}
          onClick={() => handleSeatClick(seat.row, start + idx)}
        >
          {seat.id}
        </div>
      ))}
    </div>
  );

  const totalPrice = selectedSeats.reduce((t, s) => t + s.price, 0);

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;

    setSeats((prev) =>
      prev.map((row) =>
        row.map((seat) =>
          selectedSeats.some((x) => x.id === seat.id)
            ? { ...seat, status: "booked", selected: false }
            : seat
        )
      )
    );

    onBookingComplete({
      seats: selectedSeats,
      totalPrice,
      seatIds: selectedSeats.map((s) => s.id),
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setSelectedSeats([]);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="font-bold text-xl mb-1">Booking Confirmed!</h2>
            <p className="text-gray-600">Your seats are booked.</p>
          </div>
        </div>
      )}

      {/* Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">{title}</h1>
        <p className="text-center text-gray-500 mb-6">{subtitle}</p>

        {/* Screen */}
        <div className="mb-8">
          <div className="w-full h-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-b-2xl shadow-inner" />
          <p className="text-center text-sm text-gray-500 mt-1 tracking-wide">
            SCREEN
          </p>
        </div>

        {/* Seats */}
        <div className="overflow-x-auto mb-6">
          <div className="flex flex-col items-center min-w-max">
            {seats.map((row, ri) => {
              let blocks = [];
              let last = 0;

              aislePositions.forEach((a, i) => {
                blocks.push(renderSection(row, last, a));
                blocks.push(<div key={`space${i}`} className="w-6" />);
                last = a;
              });

              blocks.push(renderSection(row, last, layout.seatPerRow));

              return (
                <div key={ri} className="flex items-center mb-2">
                  <span className="w-6 text-gray-600 font-medium mr-2">
                    {String.fromCharCode(65 + ri)}
                  </span>
                  {blocks}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-4">
          <h3 className="font-semibold mb-2">Booking Summary</h3>
          {selectedSeats.length === 0 ? (
            <p className="text-gray-500">No seats selected.</p>
          ) : (
            <>
              <p className="mb-1">
                Seats:{" "}
                <span className="font-medium">
                  {selectedSeats.map((s) => s.id).join(", ")}
                </span>
              </p>
              <p className="mb-1">
                Count:
                <span className="font-medium ml-1">{selectedSeats.length}</span>
              </p>
              <p className="text-lg font-bold text-indigo-600">
                Total: {currency}
                {totalPrice}
              </p>
            </>
          )}
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            selectedSeats.length > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedSeats.length > 0
            ? `Book ${selectedSeats.length} Seat(s) • ${currency}${totalPrice}`
            : "Select seats"}
        </button>
      </div>
    </div>
  );
};

export default CinemaSeatBooking;
