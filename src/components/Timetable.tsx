
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Timetable = () => {
  // Timetable data exactly as provided
  const timetableData = [
    ["Day/Time", "8 - 9", "9 - 10", "10 - 11", "11 - 12", "12 - 1", "1 - 1:30", "2 - 3", "3 - 4", "4 - 5", "5 - 6", "6 - 7", "7 - 7:30"],
    ["Tue", "TEE1+L1", "A1+L2", "B1+L3", "C1+L4", "D1+L5", "L6", "E2+SE1+L31", "A2+L32", "TBB2+G2+L33", "C2+L34", "TDD2+L35", "L36"],
    ["Wed", "TG1+L7", "D1+L8", "F1+L9", "E1+L10", "B1+L11", "L12", "E2+SC1+L37", "D2+L38", "F2+L39", "B2+L40", "TCC2+L41", "L42"],
    ["Thu", "TF1+L13", "TC1+L14", "TD1+L15", "TA1+L16", "TFF1+CLUBS+ECS+L17", "L18", "B2+L43", "F2+L44", "TD2+L45", "TA2+L46", "TG2+L47", "L48"],
    ["Fri", "TCC1+L19", "TB1+L20", "TAA1+G1+L21", "TE1+L22", "F1+L23", "L24", "C2+L49", "TB2+L50", "TAA2+G2+L51", "TE2+SD1+L52", "TF2+L53", "L54"],
    ["Sat", "TDD1+L25", "C1+L26", "A1+L27", "TBB1+G1+L28", "E1+L29", "L30", "D2+L55", "TC2+L56", "A2+L57", "SF1+CLUBS+ECS+L58", "TEE2+L59", "L60"]
  ];

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  // Helper function to get course name from slot (remove numbers and special chars)
  const getCourseFromSlot = (slot: string): string => {
    return slot.replace(/[0-9]/g, '').replace(/[^A-Z]/g, '');
  };

  // Helper function to find all slots for a specific course across all days
  const findAllSlotsForCourse = (courseName: string): string[] => {
    const allSlots: string[] = [];
    
    timetableData.slice(1).forEach(row => {
      row.slice(1).forEach(cell => {
        cell.split('+').forEach(slot => {
          const trimmedSlot = slot.trim();
          if (getCourseFromSlot(trimmedSlot) === courseName) {
            allSlots.push(trimmedSlot);
          }
        });
      });
    });
    
    return allSlots;
  };

  // Helper function to get all slots in the same time period
  const getSlotsInSameTimePeriod = (targetSlot: string): string[] => {
    const conflictingSlots: string[] = [];
    let targetDayIndex = -1;
    let targetTimeIndex = -1;

    // Find the position of the target slot
    timetableData.slice(1).forEach((row, dayIndex) => {
      row.slice(1).forEach((cell, timeIndex) => {
        if (cell.split('+').some(slot => slot.trim() === targetSlot)) {
          targetDayIndex = dayIndex;
          targetTimeIndex = timeIndex;
        }
      });
    });

    if (targetDayIndex !== -1 && targetTimeIndex !== -1) {
      // Get all slots in the same time period on the same day
      const cell = timetableData[targetDayIndex + 1][targetTimeIndex + 1];
      cell.split('+').forEach(slot => {
        const trimmedSlot = slot.trim();
        if (trimmedSlot && trimmedSlot !== targetSlot) {
          conflictingSlots.push(trimmedSlot);
        }
      });
    }

    return conflictingSlots;
  };

  // Check if there are overlapping courses between selected slots and a new slot
  const hasOverlappingCourses = (newSlot: string): boolean => {
    const newSlotCourse = getCourseFromSlot(newSlot);
    
    for (const selectedSlot of selectedSlots) {
      const selectedCourse = getCourseFromSlot(selectedSlot);
      
      // Check if courses overlap (same course name)
      if (newSlotCourse === selectedCourse && newSlotCourse !== '') {
        return true;
      }
    }
    
    return false;
  };

  // Get all slots that should be disabled based on current selection
  const getDisabledSlots = (): string[] => {
    const disabledSlots = new Set<string>();

    selectedSlots.forEach(selectedSlot => {
      // Disable slots in the same time period
      const sameTimePeriodSlots = getSlotsInSameTimePeriod(selectedSlot);
      sameTimePeriodSlots.forEach(slot => disabledSlots.add(slot));

      // Disable related course slots
      const courseName = getCourseFromSlot(selectedSlot);
      if (courseName) {
        const relatedSlots = findAllSlotsForCourse(courseName);
        relatedSlots.forEach(slot => {
          if (slot !== selectedSlot) {
            disabledSlots.add(slot);
          }
        });
      }
    });

    return Array.from(disabledSlots);
  };

  const isSlotSelected = (slotId: string): boolean => {
    return selectedSlots.includes(slotId);
  };

  const isSlotDisabled = (slotId: string): boolean => {
    if (isSlotSelected(slotId)) return false;
    
    const disabledSlots = getDisabledSlots();
    
    // Check if slot is disabled due to same time period or course conflicts
    if (disabledSlots.includes(slotId)) return true;
    
    // Check for overlapping courses
    return hasOverlappingCourses(slotId);
  };

  const handleSlotClick = (slotId: string) => {
    if (isSlotDisabled(slotId)) return;

    if (isSlotSelected(slotId)) {
      setSelectedSlots(prev => prev.filter(id => id !== slotId));
    } else {
      setSelectedSlots(prev => [...prev, slotId]);
    }
  };

  const getSlotButtonVariant = (slotId: string) => {
    if (isSlotSelected(slotId)) return 'default';
    if (isSlotDisabled(slotId)) return 'secondary';
    return 'outline';
  };

  const getSlotButtonClassName = (slotId: string) => {
    const baseClasses = "w-full h-auto p-1 flex flex-col items-center text-center text-xs min-h-8";
    
    if (isSlotSelected(slotId)) {
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
    
    if (isSlotDisabled(slotId)) {
      return `${baseClasses} bg-muted text-muted-foreground cursor-not-allowed opacity-50`;
    }
    
    return `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
  };

  const isLabSlot = (slot: string) => {
    return slot.startsWith('L') && /^\d/.test(slot.slice(1));
  };

  const getSlotTypeColor = (slot: string) => {
    if (isLabSlot(slot)) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            FALL SEMESTER (2024-2025) 'Slot Timetable Annexure'
          </CardTitle>
          <div className="text-sm text-muted-foreground text-center">
            Selected slots: {selectedSlots.length}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-muted">
                  {timetableData[0].map((header, index) => (
                    <th key={index} className="border border-gray-300 p-3 text-center font-semibold min-w-24">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetableData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 p-1">
                        {cellIndex === 0 ? (
                          // Day column
                          <div className="p-2 text-center font-medium bg-muted/50">
                            {cell}
                          </div>
                        ) : (
                          // Time slot cells
                          <div className="min-h-16 flex flex-col gap-1">
                            {cell.split('+').map((slot, slotIndex) => {
                              const trimmedSlot = slot.trim();
                              if (!trimmedSlot) return null;
                              
                              return (
                                <Button
                                  key={slotIndex}
                                  variant={getSlotButtonVariant(trimmedSlot)}
                                  className={getSlotButtonClassName(trimmedSlot)}
                                  onClick={() => handleSlotClick(trimmedSlot)}
                                  disabled={isSlotDisabled(trimmedSlot)}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-xs">{trimmedSlot}</span>
                                    <Badge className={`text-xs ${getSlotTypeColor(trimmedSlot)}`}>
                                      {isLabSlot(trimmedSlot) ? 'lab' : 'theory'}
                                    </Badge>
                                  </div>
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
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
                  {selectedSlots.map(slotId => (
                    <Badge key={slotId} variant="default" className="text-sm">
                      {slotId}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-sm text-muted-foreground">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Click on slots to select/deselect them</li>
              <li>Theory slots are marked in blue, Lab slots in green</li>
              <li>When you select a slot, other slots in the same time period become unselectable</li>
              <li>Related course slots (same course code) across different days become unselectable</li>
              <li>The system prevents overlapping course selections</li>
              <li>Disabled slots are shown in gray and cannot be clicked</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
