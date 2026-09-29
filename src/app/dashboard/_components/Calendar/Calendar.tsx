"use client";

import React, {useState, useEffect} from "react";
import Image from "next/image";
import Tooltip from "@/app/dashboard/_components/Tooltip/Tooltip";
import {handleGetBookedSlots} from "@/actions/calendar.actions";
import "./Calendar.css";
import {BookedSlot} from "@/lib/services/calendar.service";

interface CalendarEvent {
    day: number;
    month: number;
    year: number;
    title: string;
    time: string;
}

const WEEK_DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const Calendar: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
    const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSlots = async () => {
            const result = await handleGetBookedSlots();
            if (result.success && result.data) {
                // Process the API data into the UI format
                const processed = result.data.results.map((slot: BookedSlot) => {
                    const date = new Date(slot.availability_slot.start_time);
                    return {
                        day: date.getDate(),
                        month: date.getMonth(),
                        year: date.getFullYear(),
                        title: `Session with ${slot.name}`, // Uses the 'name' field from model
                        time: date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                    };
                });
                setEvents(processed);
            }
            setLoading(false);
        };
        fetchSlots();
    }, []);

    const goToPrev = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };

    const goToNext = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

    const monthEvents = events.filter((e) => e.month === currentMonth && e.year === currentYear);
    const getEventsForDay = (day: number) => monthEvents.filter((e) => e.day === day);

    const totalCells = firstDay + daysInMonth;
    const trailingEmpty = 42 - totalCells;
    if (loading) return <div className="calendar--container">Loading events...</div>;

    return (
        <div className="calendar--container">
            <div className="calendar--header">
                <p className="calendar--title">Upcoming Events</p>
                <div className="calendar--controls">
                    <button type="button" className="calendar--nav-btn" aria-label="Previous month" onClick={goToPrev}>
                        <Image src="/assets/icons/LeftArrowIcon.svg" alt="" width={24} height={24}/>
                    </button>
                    <span className="calendar--current-month">{MONTH_NAMES[currentMonth]} {currentYear}</span>
                    <button type="button" className="calendar--nav-btn" aria-label="Next month" onClick={goToNext}>
                        <Image src="/assets/icons/RightArrowIcon.svg" alt="" width={24} height={24}/>
                    </button>
                </div>
            </div>

            <div className="calendar--body">
                <div className="calendar--events-column">
                    {monthEvents.length === 0 ? (
                        <p className="calendar--no-events">No events this month.</p>
                    ) : (
                        <div className="calendar--events-scroll">
                            {monthEvents.map((event, index) => (
                                <div key={index} className="calendar--event-card">
                                    <div className="calendar--event-image-wrapper">
                                        <Image src="/assets/icons/Calendar_icon.png" alt="Icon" fill
                                               className="calendar--event-icon"/>
                                    </div>
                                    <div className="calendar--event-details">
                                        <div className="calendar--event-date">
                                            <span
                                                className="calendar--event-month">{MONTH_NAMES[event.month].slice(0, 3).toUpperCase()}</span>
                                            <span className="calendar--event-day">{event.day}</span>
                                        </div>
                                        <div className="calendar--event-info">
                                            <p className="calendar--event-title">{event.title}</p>
                                            <p className="calendar--event-time">{event.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="calendar--column">
                    <div className="calendar--weekday-headers">
                        {WEEK_DAYS.map((day) => <div key={day} className="calendar--weekday-header">{day}</div>)}
                    </div>
                    <div className="calendar--grid">
                        {Array.from({length: firstDay}).map((_, i) => (
                            <div key={`empty-start-${i}`} className="calendar--day-cell calendar--day-cell-empty"/>
                        ))}
                        {Array.from({length: daysInMonth}).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDay(day);
                            const isActive = dayEvents.length > 0;
                            return (
                                <div key={`day-${day}`}
                                     className={`calendar--day-cell ${isActive ? "calendar--day-cell-active" : ""}`}>
                                    <span className="calendar--day-number">{day}</span>
                                    {isActive && (
                                        <Tooltip text={dayEvents.map((e) => e.title).join(", ")}>
                      <span className="calendar--day-label calendar--day-label-desktop">
                        {dayEvents.length > 1 ? `${dayEvents.length} events` : dayEvents[0].title}
                      </span>
                                            <span className="calendar--day-dot"/>
                                        </Tooltip>
                                    )}
                                </div>
                            );
                        })}
                        {Array.from({length: trailingEmpty}).map((_, i) => (
                            <div key={`empty-end-${i}`} className="calendar--day-cell calendar--day-cell-empty"/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;