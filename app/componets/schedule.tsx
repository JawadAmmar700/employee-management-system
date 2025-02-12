import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import type { TimeSheetType } from "~/utils/zod";

type CalendarEventTypes = {
  timesheets: (TimeSheetType & { full_name: string })[];
};

function CalendarApp({ timesheets }: CalendarEventTypes) {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      ...timesheets.map((timesheet) => {
        return {
          id: timesheet.id,
          title: timesheet.full_name,
          start: timesheet.start_time,
          end: timesheet.end_time,
        };
      }),
    ],
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-full lg:max-w-5xl mx-auto h-[500px] overflow-y-scroll rounded-lg shadow-lg bg-white">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  );
}

export default CalendarApp;
