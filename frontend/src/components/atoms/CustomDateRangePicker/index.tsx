import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, getMonth, getYear } from 'date-fns';
import style from './index.module.scss';
import CustomButton from '@atoms/CustomButton';

export default function CustomDateRangePicker({
    maxDate,
    minDate,
    start,
    end,
    onChange,
}: {
    maxDate?: Date;
    minDate?: Date;
    start: Date | null;
    end: Date | null;
    onChange: ({ start, end }: { start: Date | null; end: Date | null }) => void;
}) {
    const pickerRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(start);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(end);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShow(false);
                setSelectedStartDate(start);
                setSelectedEndDate(end);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="position-relative" ref={pickerRef}>
            <div className={style.inputBox} onClick={() => setShow(true)}>
                <i className={`font icon-calendar-days ${start && end ? '' : 'text-muted'}`}></i>
                <p className={start && end ? '' : 'text-muted'}>
                    {start && end ? (
                        <>
                            {format(start, start.getFullYear() === end.getFullYear() ? 'LLL dd' : 'LLL dd, yyyy')}
                            <span className="mx-2">-</span>
                            {format(end, 'LLL dd, yyyy')}
                        </>
                    ) : (
                        'Filter by date'
                    )}
                </p>
            </div>

            <div className={`${style.wrapper} ${show ? 'd-block' : 'd-none'}`}>
                <div className={style.innerWrap}>
                    <DatePicker
                        calendarClassName={style.pickerWrap}
                        selected={end}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={(update: any) => {
                            setSelectedStartDate(update[0]);
                            setSelectedEndDate(update[1]);
                        }}
                        startDate={selectedStartDate}
                        endDate={selectedEndDate}
                        selectsRange
                        inline
                        calendarStartDay={0}
                        renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => {
                            const isNextDisabled =
                                maxDate &&
                                getMonth(monthDate) === getMonth(maxDate) &&
                                getYear(monthDate) === getYear(maxDate);
                            const isPrevDisabled =
                                minDate &&
                                getMonth(monthDate) === getMonth(minDate) &&
                                getYear(monthDate) === getYear(minDate);
                            return (
                                <div className={style.header}>
                                    <span>
                                        {monthDate.toLocaleString('default', {
                                            month: 'long',
                                        })}{' '}
                                        {monthDate.getFullYear()}
                                    </span>
                                    <div className="d-flex gap-2">
                                        <i
                                            className={`font icon-arrow-left ${isPrevDisabled ? style.disabled : ''}`}
                                            onClick={!isPrevDisabled ? decreaseMonth : undefined}
                                        ></i>
                                        <i
                                            className={`font icon-arrow-right ${isNextDisabled ? style.disabled : ''}`}
                                            onClick={!isNextDisabled ? increaseMonth : undefined}
                                        ></i>
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <div className={style.pickerFooter}>
                        <span>
                            {selectedStartDate
                                ? format(
                                      selectedStartDate,
                                      selectedStartDate.getFullYear() === selectedEndDate?.getFullYear()
                                          ? 'LLL dd'
                                          : 'LLL dd, yyyy'
                                  ) + ' - '
                                : ''}
                            {selectedEndDate ? format(selectedEndDate, 'LLL dd, yyyy') : ''}
                        </span>
                        <div className="flex items-center justify-end gap-1">
                            <CustomButton
                                variant="outline-secondary"
                                onClick={() => {
                                    setSelectedStartDate(start);
                                    setSelectedEndDate(end);
                                    setShow(false);
                                }}
                            >
                                Cancel
                            </CustomButton>
                            <CustomButton
                                variant="secondary"
                                disabled={!selectedEndDate}
                                onClick={() => {
                                    onChange({
                                        start: selectedStartDate,
                                        end: selectedEndDate,
                                    });
                                    setShow(false);
                                }}
                            >
                                Apply
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
