'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css'; // Custom styles for luxury feel
import { Card } from '../ui/Card';
import Button from '../ui/Button';

export default function BookingCalendar({ property }) {
  const [dateRange, setDateRange] = useState([new Date(), new Date(new Date().getTime() + 24 * 60 * 60 * 1000)]);

  const onChange = (value) => {
    setDateRange(value);
  };

  return (
    <Card className="p-8 border-none bg-white shadow-2xl rounded-[40px] space-y-8">
      <header>
        <h3 className="text-2xl font-black text-primary-dark uppercase tracking-widest">Select Stay Dates</h3>
        <p className="text-sm text-neutral font-medium">Minimum stay: 1 night</p>
      </header>

      <div className="calendar-container">
        <Calendar
          onChange={onChange}
          value={dateRange}
          selectRange={true}
          minDate={new Date()}
          className="luxury-calendar"
        />
      </div>

      <div className="p-6 bg-neutral-light/50 rounded-[32px] border border-neutral/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-1">
          <p className="text-[10px] font-black text-neutral uppercase tracking-widest">Stay Summary</p>
          <div className="flex items-center gap-3">
            <span className="font-black text-primary-dark">{dateRange[0]?.toLocaleDateString()}</span>
            <span className="text-neutral">→</span>
            <span className="font-black text-primary-dark">{dateRange[1]?.toLocaleDateString() || '...'}</span>
          </div>
        </div>
        <div className="text-center md:text-right">
           <p className="text-2xl font-black text-primary">{property.formattedPrice}</p>
           <p className="text-[10px] font-black text-neutral uppercase tracking-widest">Total may vary</p>
        </div>
      </div>

      <Button className="w-full h-16 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20">
        Check Availability
      </Button>
    </Card>
  );
}
