import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainerSelector from '../components/booking/TrainerSelector';
import ClassSelector from '../components/booking/ClassSelector';
import CustomDatePicker from '../components/booking/DatePicker';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import UserDetailsForm from '../components/booking/UserDetailsForm';
import { checkAvailability, createBooking } from '../services/booking';
import { createUser } from '../services/user';
import { formatDateISO } from '../utils/dateFormatter';

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState('trainer');
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [userData, setUserData] = useState({
    phone_number: '',
    name: '',
    age: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backgroundStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1887&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '2rem',
  };

  const overlayStyle = {
    backgroundColor: 'rgba(5, 5, 25, 0.9)', // was 0.9
    borderRadius: '212px',
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(10,0,0,0.2)',
  };

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const calculateEndTime = (start, durationMinutes) => {
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + durationMinutes;
    const endHour = Math.floor(total / 60).toString().padStart(2, '0');
    const endMin = (total % 60).toString().padStart(2, '0');
    return `${endHour}:${endMin}`;
  };

  const checkAvailabilityHandler = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        appointment_date: formatDateISO(selectedDate),
        start_time: selectedTime,
        end_time: calculateEndTime(selectedTime, 30),
      };

      if (bookingType === 'trainer' && selectedTrainerId) {
        payload.trainer_id = selectedTrainerId;
      } else if (bookingType === 'class' && selectedClassId) {
        payload.class_id = selectedClassId;
      } else {
        setError('Please select a trainer or class');
        setLoading(false);
        return;
      }

      const result = await checkAvailability(payload);
      if (result.available) {
        setStep(2);
      } else {
        setError(result.message || 'Selected time not available');
      }
    } catch (err) {
      setError('Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!userData.phone_number) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createUser({
        phone_number: userData.phone_number,
        name: userData.name || null,
        age: userData.age ? parseInt(userData.age) : null,
      });

      const bookingPayload = {
        user_phone: userData.phone_number,
        appointment_date: formatDateISO(selectedDate),
        start_time: selectedTime,
        end_time: calculateEndTime(selectedTime, 30),
      };

      if (bookingType === 'trainer') {
        bookingPayload.trainer_id = selectedTrainerId;
      } else {
        bookingPayload.class_id = selectedClassId;
      }

      await createBooking(bookingPayload);
      setStep(3);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <h1 className="text-3xl font-bold mb-6">Book Your Trial Session</h1>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Type
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setBookingType('trainer')}
                  className={`px-4 py-2 rounded-md ${
                    bookingType === 'trainer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Personal Trainer
                </button>
                <button
                  onClick={() => setBookingType('class')}
                  className={`px-4 py-2 rounded-md ${
                    bookingType === 'class'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Group Class
                </button>
              </div>
            </div>

            {bookingType === 'trainer' ? (
              <TrainerSelector
                selectedTrainerId={selectedTrainerId}
                onSelect={setSelectedTrainerId}
              />
            ) : (
              <ClassSelector
                selectedClassId={selectedClassId}
                onSelect={setSelectedClassId}
              />
            )}

            <CustomDatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            <TimeSlotPicker
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
            />

            {error && <div className="text-red-500">{error}</div>}

            <button
              onClick={checkAvailabilityHandler}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Checking...' : 'Check Availability'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your Details</h2>
            <UserDetailsForm userData={userData} onChange={handleUserChange} />
            {error && <div className="text-red-500">{error}</div>}
            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
            <p>Your trial session has been booked successfully.</p>
            <p>A confirmation message will be sent to your WhatsApp (once integrated).</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;