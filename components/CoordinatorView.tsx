import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Booking } from '../types';

const CoordinatorView: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!supabase || !selectedDate) return;
            setLoading(true);
            setError(null);

            const startDate = `${selectedDate}T00:00:00Z`;
            const endDate = `${selectedDate}T23:59:59Z`;

            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        notes_for_coordinator,
                        profiles ( full_name ),
                        booking_items ( equipment ( * ) )
                    `)
                    .gte('start_date', startDate)
                    .lte('start_date', endDate)
                    .order('created_at');

                if (error) throw error;
                // Supabase type generation can be tricky with complex joins, so we cast here
                setBookings(data as any[] as Booking[] || []);
            } catch (error) {
                const err = error as { message: string };
                setError(`Failed to load bookings. Have you run the setup SQL? Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [selectedDate]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Daily Staging List</h2>
            <div className="mb-4">
                <label htmlFor="staging-date" className="block text-sm font-medium text-gray-400 mb-1">Select Date</label>
                <input
                    id="staging-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-base-300 text-white placeholder-gray-500 px-4 py-2 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition"
                />
            </div>
             {loading && <p>Loading bookings for {selectedDate}...</p>}
             {error && <p className="text-red-400">{error}</p>}

             {!loading && !error && (
                <div className="space-y-6">
                    {bookings.length > 0 ? bookings.map(booking => (
                        <div key={booking.id} className="bg-base-300 p-4 rounded-lg">
                            <h3 className="font-bold text-white text-lg">{booking.profiles?.full_name || 'Unknown Technician'}</h3>
                            {booking.notes_for_coordinator && (
                                <p className="text-sm text-yellow-300 bg-yellow-900/50 p-2 rounded-md my-2">
                                    <strong>Notes:</strong> {booking.notes_for_coordinator}
                                </p>
                            )}
                            <ul className="mt-2 space-y-2">
                                {booking.booking_items.map(item => (
                                    <li key={item.equipment.id} className="flex items-center gap-3 p-2 bg-base-100 rounded">
                                        <input type="checkbox" className="h-5 w-5 rounded bg-base-300 border-gray-500 text-brand-primary focus:ring-brand-primary" />
                                        <div>
                                            <span className="text-content">{item.equipment.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">S/N: {item.equipment.serial_number || 'N/A'}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )) : (
                         <p className="text-gray-500">No equipment booked for pickup on this day.</p>
                    )}
                </div>
             )}
        </div>
    );
};

export default CoordinatorView;
