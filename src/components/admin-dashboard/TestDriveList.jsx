import React from 'react';
import { Calendar } from 'lucide-react';

const TestDrivesList = ({ testDrives, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Upcoming Test Drives</h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading test drives...</div>
        ) : testDrives.length === 0 ? (
          <div className="text-center text-gray-500">No upcoming test drives</div>
        ) : (
          testDrives.map((drive, index) => (
            <div key={index} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 last:border-0">
              <div>
                <div className="font-semibold">{drive.customerName || 'Customer'}</div>
                <div className="text-sm text-gray-500">{drive.vehicleName || 'Vehicle'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{drive.date || 'TBD'}</span>
                </div>
                {drive.time && (
                  <div className="text-xs text-gray-400">{drive.time}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestDrivesList;