'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Plus } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string; // Comma separated string "Fiat, VW"
  onChange: (val: string) => void;
  placeholder: string;
  name: string;
}

export default function MultiSelect({ label, options, value, onChange, placeholder, name }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedList = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
  const [customInput, setCustomInput] = useState('');
  
  // Use a local list of options that can grow if user adds custom ones
  const [availableOptions, setAvailableOptions] = useState<string[]>(options);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update original value string when selection changes
  const toggleOption = (opt: string) => {
    const isSelected = selectedList.includes(opt);
    let newList;
    if (isSelected) {
      newList = selectedList.filter(o => o !== opt);
    } else {
      newList = [...selectedList, opt];
    }
    onChange(newList.join(', '));
  };

  const handleAddCustom = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customInput.trim()) return;
    
    const formatted = customInput.trim();
    if (!availableOptions.includes(formatted)) {
      setAvailableOptions([formatted, ...availableOptions]);
    }
    if (!selectedList.includes(formatted)) {
      onChange([...selectedList, formatted].join(', '));
    }
    setCustomInput('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      
      <div 
        className="min-h-[42px] w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer flex flex-wrap gap-2 items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selectedList.length === 0 && <span className="text-gray-500">{placeholder}</span>}
          {selectedList.map(item => (
            <span key={item} className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md text-sm font-medium border border-blue-500/30">
              {item}
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleOption(item); }}
                className="hover:text-blue-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1f2937] border border-[#374151] rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          
          {/* Custom Input Header */}
          <div className="p-2 border-b border-[#374151] sticky top-0 bg-[#1f2937] z-10 flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-[#111827] border border-[#374151] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Adicionar novo..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleAddCustom}
              onClick={(e) => e.stopPropagation()} // Keep popover open
            />
            <button 
              type="button" 
              onClick={handleAddCustom}
              className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Options List */}
          <div className="p-1">
            {availableOptions.map(opt => {
              const isSelected = selectedList.includes(opt);
              return (
                <div 
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#374151]/50 rounded-lg group transition-colors text-gray-300 hover:text-white"
                >
                  <div className={`w-4 h-4 flex items-center justify-center rounded border transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-[#4b5563] group-hover:border-gray-400'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
