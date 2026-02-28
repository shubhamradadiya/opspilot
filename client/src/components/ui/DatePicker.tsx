import React, { forwardRef } from 'react';
import ReactDatePicker, { DatePickerProps as DatePickerPropsReact } from 'react-datepicker';
import { Calendar as CalendarIcon } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps extends Omit<DatePickerPropsReact, 'onChange' | 'value'> {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const CustomInput = forwardRef<HTMLDivElement, any>(
  ({ value, onClick, onChange, placeholder, disabled, id }, ref) => (
    <div 
      ref={ref} 
      onClick={!disabled ? onClick : undefined}
      className={`relative w-full ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        className={`w-full h-9 pl-9 pr-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      />
      <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
    </div>
  )
);
CustomInput.displayName = 'CustomInput';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  fullWidth = true,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
          {label}
        </label>
      )}
      <div className="relative custom-datepicker">
        <ReactDatePicker
          selected={value}
          onChange={(date: any) => onChange(date as Date | null)}
          customInput={<CustomInput />}
          calendarClassName="gold-theme-calendar"
          {...(props as any)}
        />
      </div>
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
};
