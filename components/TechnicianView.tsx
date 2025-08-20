import React from 'react';
import { Profile } from '../types';

interface TechnicianViewProps {
  profile: Profile;
}

const TechnicianView: React.FC<TechnicianViewProps> = ({ profile }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">My Dashboard</h2>
      <div className="bg-base-300 p-8 rounded-lg text-center">
        <p className="text-content">Technician dashboard coming soon!</p>
        <p className="text-sm text-gray-500">This section will show your current, upcoming, and past equipment bookings.</p>
      </div>
    </div>
  );
};

export default TechnicianView;
