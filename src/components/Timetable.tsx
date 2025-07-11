
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  id: string;
  subject: string;
  time: string;
  day: string;
  type: 'lecture' | 'lab' | 'tutorial';
  conflictsWith?: string[];
}

const Timetable = () => {
  // Sample timetable data
  const timeSlots: TimeSlot[] = [
    { id: 'A1', subject: 'Mathematics', time: '09:00-10:00', day: 'Monday', type: 'lecture', conflictsWith: ['L1'] },
    { id: 'A2', subject: 'Physics', time: '10:00-11:00', day: 'Monday', type: 'lecture' },
    { id: 'B1', subject: 'Chemistry', time: '09:00-10:00', day: 'Tuesday', type: 'lecture' },
    { id: 'B2', subject: 'Biology', time: '10:00-11:00', day: 'Tuesday', type: 'lecture' },
    { id: 'C1', subject: 'English', time: '09:00-10:00', day: 'Wednesday', type: 'lecture' },
    { id: 'C2', subject: 'History', time: '10:00-11:00', day: 'Wednesday', type: 'lecture' },
    { id: 'D1', subject: 'Geography', time: '09:00-10:00', day: 'Thursday', type: 'lecture' },
    { id: 'D2', subject: 'Economics', time: '10:00-11:00', day: 'Thursday', type: 'lecture' },
    { id: 'E1', subject: 'Computer Science', time: '09:00-10:00', day: 'Friday', type: 'lecture' },
    { id: 'E2', subject: 'Statistics', time: '10:00-11:00', day: 'Friday', type: 'lecture' },
    { id: 'L1', subject: 'Math Lab', time: '11:00-12:00', day: 'Monday', type: 'lab', conflictsWith: ['A1'] },
    { id: 'L2', subject: 'Physics Lab', time: '11:00-12:00', day: 'Tuesday', type: 'lab' },
    { id: 'L3', subject: 'Chemistry Lab', time: '11:00-12:00', day: 'Wednesday', type: 'lab' },
    { id: 'L4', subject: 'CS Lab', time: '11:00-12:00', day: 'Thursday', type: 'lab' },
    { id: 'L5', subject: 'Biology Lab', time: '11:00-12:00', day: 'Friday', type: 'lab' },
  ];

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlotsByDay = days.reduce((acc, day) => {
    acc[day] = timeSlots.filter(slot => slot.day === day);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const isSlotDisabled = (slotId: string): boolean => {
    const slot = timeSlots.find(s => s.id === slotId);
    if (!slot || !slot.conflictsWith) return false;

    return slot.conflictsWith.some(conflictId => selectedSlots.includes(conflictId));
  };

  const isSlotSelected = (slotId: string): boolean => {
    return selectedSlots.includes(slotId);
  };

  const getConflictingSlots = (slotId: string): string[] => {
    const slot = timeSlots.find(s => s.id === slotId);
    return slot?.conflictsWith || [];
  };

  const handleSlotClick = (slotId: string) => {
    if (isSlotDisabled(slotId)) return;

    if (isSlotSelected(slotId)) {
      // Deselect the slot
      setSelectedSlots(prev => prev.filter(id => id !== slotId));
    } else {
      // Select the slot
      setSelectedSlots(prev => [...prev, slotId]);
    }
  };

  const getSlotButtonVariant = (slotId: string) => {
    if (isSlotSelected(slotId)) return 'default';
    if (isSlotDisabled(slotId)) return 'secondary';
    return 'outline';
  };

  const getSlotTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {days.map(day => (
              <div key={day} className="space-y-2">
                <h3 className="font-semibold text-lg text-center py-2 bg-muted rounded-lg">
                  {day}
                </h3>
                <div className="space-y-2">
                  {timeSlotsByDay[day]?.map(slot => (
                    <Button
                      key={slot.id}
                      variant={getSlotButtonVariant(slot.id)}
                      className={`w-full h-auto p-3 flex flex-col items-start text-left ${
                        isSlotDisabled(slot.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleSlotClick(slot.id)}
                      disabled={isSlotDisabled(slot.id)}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-semibold text-sm">{slot.id}</span>
                        <Badge className={`text-xs ${getSlotTypeColor(slot.type)}`}>
                          {slot.type}
                        </Badge>
                      </div>
                      <div className="text-xs font-medium">{slot.subject}</div>
                      <div className="text-xs text-muted-foreground">{slot.time}</div>
                      {slot.conflictsWith && slot.conflictsWith.length > 0 && (
                        <div className="text-xs text-orange-600 mt-1">
                          Conflicts: {slot.conflictsWith.join(', ')}
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedSlots.length > 0 && (
            <Card className="bg-muted/50">
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
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Click on slots to select/deselect them</li>
              <li>Some slots have conflicts (e.g., A1 conflicts with L1)</li>
              <li>When you select a slot, conflicting slots become disabled</li>
              <li>Deselect a slot to enable its conflicting slots again</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
