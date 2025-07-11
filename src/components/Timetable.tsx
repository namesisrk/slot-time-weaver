
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  id: string;
  subject: string;
  time: string;
  day: string;
  type: 'theory' | 'lab';
  conflictsWith?: string[];
}

const Timetable = () => {
  // Exact timetable data from your image
  const timeSlots: TimeSlot[] = [
    // Monday
    { id: 'A1', subject: 'Physics', time: '08:00-08:50', day: 'Monday', type: 'theory' },
    { id: 'F1', subject: 'Mathematics-I', time: '08:50-09:40', day: 'Monday', type: 'theory' },
    { id: 'D1', subject: 'Engineering Chemistry', time: '09:40-10:30', day: 'Monday', type: 'theory' },
    { id: 'TB1', subject: 'Mathematics-I', time: '10:50-11:40', day: 'Monday', type: 'theory' },
    { id: 'TG1', subject: 'English', time: '11:40-12:30', day: 'Monday', type: 'theory' },
    { id: 'L1', subject: 'Physics Lab', time: '14:00-16:50', day: 'Monday', type: 'lab' },

    // Tuesday
    { id: 'B1', subject: 'Engineering Chemistry', time: '08:00-08:50', day: 'Tuesday', type: 'theory' },
    { id: 'G1', subject: 'English', time: '08:50-09:40', day: 'Tuesday', type: 'theory' },
    { id: 'E1', subject: 'Basic Electrical Engineering', time: '09:40-10:30', day: 'Tuesday', type: 'theory' },
    { id: 'TC1', subject: 'Engineering Chemistry', time: '10:50-11:40', day: 'Tuesday', type: 'theory' },
    { id: 'TAA1', subject: 'Physics', time: '11:40-12:30', day: 'Tuesday', type: 'theory' },
    { id: 'L2', subject: 'Basic Electrical Engineering Lab', time: '14:00-16:50', day: 'Tuesday', type: 'lab' },

    // Wednesday
    { id: 'C1', subject: 'Basic Electrical Engineering', time: '08:00-08:50', day: 'Wednesday', type: 'theory' },
    { id: 'A2', subject: 'Physics', time: '08:50-09:40', day: 'Wednesday', type: 'theory' },
    { id: 'F2', subject: 'Mathematics-I', time: '09:40-10:30', day: 'Wednesday', type: 'theory' },
    { id: 'TD1', subject: 'Basic Electrical Engineering', time: '10:50-11:40', day: 'Wednesday', type: 'theory' },
    { id: 'TBB1', subject: 'Mathematics-I', time: '11:40-12:30', day: 'Wednesday', type: 'theory' },
    { id: 'L3', subject: 'Engineering Chemistry Lab', time: '14:00-16:50', day: 'Wednesday', type: 'lab' },

    // Thursday
    { id: 'D2', subject: 'Engineering Chemistry', time: '08:00-08:50', day: 'Thursday', type: 'theory' },
    { id: 'C2', subject: 'Basic Electrical Engineering', time: '08:50-09:40', day: 'Thursday', type: 'theory' },
    { id: 'G2', subject: 'English', time: '09:40-10:30', day: 'Thursday', type: 'theory' },
    { id: 'TE1', subject: 'Basic Electrical Engineering', time: '10:50-11:40', day: 'Thursday', type: 'theory' },
    { id: 'TCC1', subject: 'Engineering Chemistry', time: '11:40-12:30', day: 'Thursday', type: 'theory' },
    { id: 'L4', subject: 'Computer Programming Lab', time: '14:00-16:50', day: 'Thursday', type: 'lab' },

    // Friday
    { id: 'E2', subject: 'Basic Electrical Engineering', time: '08:00-08:50', day: 'Friday', type: 'theory' },
    { id: 'B2', subject: 'Engineering Chemistry', time: '08:50-09:40', day: 'Friday', type: 'theory' },
    { id: 'A3', subject: 'Physics', time: '09:40-10:30', day: 'Friday', type: 'theory' },
    { id: 'TF1', subject: 'Mathematics-I', time: '10:50-11:40', day: 'Friday', type: 'theory' },
    { id: 'TDD1', subject: 'Basic Electrical Engineering', time: '11:40-12:30', day: 'Friday', type: 'theory' },
    { id: 'L5', subject: 'Engineering Workshop', time: '14:00-16:50', day: 'Friday', type: 'lab' },

    // Saturday
    { id: 'F3', subject: 'Mathematics-I', time: '08:00-08:50', day: 'Saturday', type: 'theory' },
    { id: 'D3', subject: 'Engineering Chemistry', time: '08:50-09:40', day: 'Saturday', type: 'theory' },
    { id: 'C3', subject: 'Basic Electrical Engineering', time: '09:40-10:30', day: 'Saturday', type: 'theory' },
    { id: 'TG2', subject: 'English', time: '10:50-11:40', day: 'Saturday', type: 'theory' },
    { id: 'TEE1', subject: 'Basic Electrical Engineering', time: '11:40-12:30', day: 'Saturday', type: 'theory' },
    { id: 'L6', subject: 'Language Lab', time: '14:00-16:50', day: 'Saturday', type: 'lab' },
  ];

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots9AM = ['08:00-08:50', '08:50-09:40', '09:40-10:30', '10:50-11:40', '11:40-12:30'];
  const labTime = '14:00-16:50';

  const timeSlotsByDay = days.reduce((acc, day) => {
    acc[day] = timeSlots.filter(slot => slot.day === day);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const isSlotSelected = (slotId: string): boolean => {
    return selectedSlots.includes(slotId);
  };

  const handleSlotClick = (slotId: string) => {
    if (isSlotSelected(slotId)) {
      setSelectedSlots(prev => prev.filter(id => id !== slotId));
    } else {
      setSelectedSlots(prev => [...prev, slotId]);
    }
  };

  const getSlotButtonVariant = (slotId: string) => {
    return isSlotSelected(slotId) ? 'default' : 'outline';
  };

  const getSlotTypeColor = (type: string) => {
    switch (type) {
      case 'theory': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTheorySlotsByTime = (day: string, time: string) => {
    return timeSlotsByDay[day]?.filter(slot => slot.time === time && slot.type === 'theory') || [];
  };

  const getLabSlot = (day: string) => {
    return timeSlotsByDay[day]?.find(slot => slot.type === 'lab');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Weekly Timetable</CardTitle>
          <div className="text-sm text-muted-foreground text-center">
            Selected slots: {selectedSlots.length}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-gray-300 p-2 text-center font-semibold">Time</th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-300 p-2 text-center font-semibold min-w-32">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots9AM.map(time => (
                  <tr key={time}>
                    <td className="border border-gray-300 p-2 text-center font-medium bg-muted/50">
                      {time}
                    </td>
                    {days.map(day => {
                      const slots = getTheorySlotsByTime(day, time);
                      const slot = slots[0]; // Get the first slot for this time
                      return (
                        <td key={`${day}-${time}`} className="border border-gray-300 p-1">
                          {slot ? (
                            <Button
                              variant={getSlotButtonVariant(slot.id)}
                              className="w-full h-auto p-2 flex flex-col items-center text-center text-xs"
                              onClick={() => handleSlotClick(slot.id)}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="font-bold text-xs">{slot.id}</span>
                                <Badge className={`text-xs ${getSlotTypeColor(slot.type)}`}>
                                  {slot.type}
                                </Badge>
                              </div>
                              <div className="text-xs font-medium text-center leading-tight">
                                {slot.subject}
                              </div>
                            </Button>
                          ) : (
                            <div className="h-16 flex items-center justify-center text-gray-400">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="border border-gray-300 p-2 text-center font-medium bg-muted/50">
                    10:30-10:50
                  </td>
                  {days.map(day => (
                    <td key={`${day}-break`} className="border border-gray-300 p-2 text-center bg-yellow-50">
                      <span className="text-xs font-medium text-yellow-700">BREAK</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center font-medium bg-muted/50">
                    12:30-14:00
                  </td>
                  {days.map(day => (
                    <td key={`${day}-lunch`} className="border border-gray-300 p-2 text-center bg-orange-50">
                      <span className="text-xs font-medium text-orange-700">LUNCH</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center font-medium bg-muted/50">
                    {labTime}
                  </td>
                  {days.map(day => {
                    const labSlot = getLabSlot(day);
                    return (
                      <td key={`${day}-lab`} className="border border-gray-300 p-1">
                        {labSlot ? (
                          <Button
                            variant={getSlotButtonVariant(labSlot.id)}
                            className="w-full h-auto p-2 flex flex-col items-center text-center text-xs"
                            onClick={() => handleSlotClick(labSlot.id)}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="font-bold text-xs">{labSlot.id}</span>
                              <Badge className={`text-xs ${getSlotTypeColor(labSlot.type)}`}>
                                {labSlot.type}
                              </Badge>
                            </div>
                            <div className="text-xs font-medium text-center leading-tight">
                              {labSlot.subject}
                            </div>
                          </Button>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-400">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {selectedSlots.length > 0 && (
            <Card className="bg-muted/50 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Selected Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedSlots.map(slotId => {
                    const slot = timeSlots.find(s => s.id === slotId);
                    return (
                      <Badge key={slotId} variant="default" className="text-sm">
                        {slot?.id} - {slot?.subject} ({slot?.day} {slot?.time})
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-sm text-muted-foreground">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Click on slots to select/deselect them</li>
              <li>Theory slots are marked in blue, Lab slots in green</li>
              <li>Each slot shows the slot ID and subject name</li>
              <li>Selected slots are highlighted and shown in the summary below</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
