import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import html2canvas from 'html2canvas';

const Timetable = () => {
  // Timetable data exactly as provided
  const timetableData = [
    ["Day/Time", "8 - 9", "9 - 10", "10 - 11", "11 - 12", "12 - 1", "1 - 1:30", "2 - 3", "3 - 4", "4 - 5", "5 - 6", "6 - 7", "7 - 7:30"],
    ["Tue", "TFF1+L1", "A1+L2", "B1+L3", "TC1+G1+L4", "D1+L5", "L6", "F2+L31", "A2+L32", "B2+L33", "TC2+G2+L34", "TDD2+L35", "L36"],
    ["Wed", "TGG1+L7", "D1+L8", "F1+L9", "E1+SC2+L10", "B1+L11", "L12", "D2+L37", "TF2+G2+L38", "E2+SC1+L39", "B2+L40", "TCC2+L41", "L42"],
    ["Thu", "TEE1+L13", "C1+L14", "TD1+TG1+L15", "TAA1+ECS+L16", "TBB1+CLUBS+L17", "L18", "TE2+SE1+L43", "C2+L44", "A2+L45", "TD2+TG2+L46", "TGG2+L47", "L48"],
    ["Fri", "TCC1+L19", "TB1+L20", "TA1+L21", "F1+L22", "TE1+SD2+L23", "L24", "C2+L49", "TB2+L50", "TA2+L51", "F2+L52", "TEE2+L53", "L54"],
    ["Sat", "TDD1+L25", "E1+SE2+L26", "C1+L27", "TF1+G1+L28", "A1+L29", "L30", "D2+L55", "E2+SD1+L56", "TAA2+ECS+L57", "TBB2+CLUBS+L58", "TFF2+L59", "L60"]
  ];

  const [selectedSlots, setSelectedSlots] = useState<{ [key: string]: { color: string; text: string } }>({});
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const [colorText, setColorText] = useState<{ [key: string]: string }>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const timetableRef = useRef<HTMLDivElement>(null);

  // Color options
  const colorOptions = [
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500', text: 'text-white', hover: 'hover:bg-blue-600' },
    { name: 'Red', value: 'red', bg: 'bg-red-500', text: 'text-white', hover: 'hover:bg-red-600' },
    { name: 'Green', value: 'green', bg: 'bg-green-500', text: 'text-white', hover: 'hover:bg-green-600' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-500', text: 'text-black', hover: 'hover:bg-yellow-600' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500', text: 'text-white', hover: 'hover:bg-purple-600' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500', text: 'text-white', hover: 'hover:bg-orange-600' },
    { name: 'Pink', value: 'pink', bg: 'bg-pink-500', text: 'text-white', hover: 'hover:bg-pink-600' },
    { name: 'Teal', value: 'teal', bg: 'bg-teal-500', text: 'text-white', hover: 'hover:bg-teal-600' },
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500', text: 'text-white', hover: 'hover:bg-indigo-600' },
    { name: 'Gray', value: 'gray', bg: 'bg-gray-500', text: 'text-white', hover: 'hover:bg-gray-600' }
  ];

  const isSlotSelected = (slotId: string): boolean => {
    return slotId in selectedSlots;
  };

  const getSlotColor = (slotId: string): string => {
    return selectedSlots[slotId]?.color || 'blue';
  };

  const getSlotText = (slotId: string): string => {
    return selectedSlots[slotId]?.text || '';
  };

  const handleSlotClick = (slotId: string) => {
    if (isSlotSelected(slotId)) {
      const newSelectedSlots = { ...selectedSlots };
      delete newSelectedSlots[slotId];
      setSelectedSlots(newSelectedSlots);
    } else {
      setSelectedSlots(prev => ({ 
        ...prev, 
        [slotId]: { 
          color: selectedColor, 
          text: colorText[selectedColor] || '' 
        } 
      }));
    }
  };

  const getSlotButtonVariant = (slotId: string) => {
    if (isSlotSelected(slotId)) return 'default';
    return 'outline';
  };

  const getSlotButtonClassName = (slotId: string) => {
    const baseClasses = "w-full h-auto p-1 flex flex-col items-center text-center text-xs min-h-8";
    
    if (isSlotSelected(slotId)) {
      const color = getSlotColor(slotId);
      const colorOption = colorOptions.find(opt => opt.value === color);
      return `${baseClasses} ${colorOption?.bg} ${colorOption?.text} ${colorOption?.hover}`;
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

  const handleColorTextChange = (color: string, text: string) => {
    setColorText(prev => ({ ...prev, [color]: text }));
  };

  const downloadTimetableAsPNG = async () => {
    if (!timetableRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(timetableRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: timetableRef.current.scrollWidth,
        height: timetableRef.current.scrollHeight,
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied in the cloned document
          const clonedElement = clonedDoc.querySelector('[data-timetable]');
          if (clonedElement) {
            clonedElement.setAttribute('style', 'transform: none !important;');
          }
        }
      });

      const link = document.createElement('a');
      link.download = `timetable-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading timetable:', error);
      alert('Failed to download timetable. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            FALL SEMESTER (2024-2025) 'Slot Timetable Annexure'
          </CardTitle>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Select Color:</label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.bg}`}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Text Label:</label>
              <Input
                type="text"
                placeholder="e.g., CSE1002"
                value={colorText[selectedColor] || ''}
                onChange={(e) => handleColorTextChange(selectedColor, e.target.value)}
                className="w-32"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Selected slots: {Object.keys(selectedSlots).length}
            </div>
            <Button 
              onClick={downloadTimetableAsPNG} 
              disabled={isDownloading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isDownloading ? 'Downloading...' : 'Download PNG'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={timetableRef} data-timetable className="overflow-x-auto">
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
                                >
                                  <div className="flex flex-col items-center justify-center w-full gap-1 min-h-12">
                                    <span className="font-bold text-xs">{trimmedSlot}</span>
                                    {isSlotSelected(trimmedSlot) && getSlotText(trimmedSlot) && (
                                      <span className="text-xs font-medium px-1 py-0.5 bg-white/20 rounded">
                                        {getSlotText(trimmedSlot)}
                                      </span>
                                    )}
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

          {Object.keys(selectedSlots).length > 0 && (
            <Card className="bg-muted/50 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Selected Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedSlots).map(([slotId, slotData]) => {
                    const colorOption = colorOptions.find(opt => opt.value === slotData.color);
                    return (
                      <Badge 
                        key={slotId} 
                        className={`text-sm ${colorOption?.bg} ${colorOption?.text}`}
                      >
                        {slotId} {slotData.text && `(${slotData.text})`}
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
              <li>Select a color from the dropdown above</li>
              <li>Enter a text label (e.g., "CSE1002") in the text input field</li>
              <li>Click on slots to select/deselect them with the chosen color and text</li>
              <li>Theory slots are marked in blue, Lab slots in green</li>
              <li>You can select any combination of slots with different colors and labels</li>
              <li>Selected slots show both the slot name and your custom text label</li>
              <li>Click "Download PNG" to save your timetable as a high-quality image</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
