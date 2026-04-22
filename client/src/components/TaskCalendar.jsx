import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment);

const TaskCalendar = ({ tasks }) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month")

  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      priority: task.priority
    }));

  return (
    <div className='bg-white p-4 rounded-xl border mt-6'>
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={view}
        onView={(newView) => setView(newView)}
        onNavigate={(newDate) => setDate(newDate)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400, width: 900 }}

        eventPropGetter={(event) => {
          let bg = "#3b82f6";

          if (event.priority === "High") bg = "#ef4444";
          if (event.priority === "Medium") bg = "#3b82f6";
          if (event.priority === "Low") bg = "#9ca3af";

          return {
            style: {
              backgroundColor: bg,
              borderRadius: "6px",
              border: "none"
            }
          }
        }}
      />
    </div>
  )
}

export default TaskCalendar
