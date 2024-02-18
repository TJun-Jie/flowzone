"use client";

import { useUser } from "@clerk/clerk-react";
import { useContext, useState, MouseEvent, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
} from "@mui/material";

import { Calendar, type Event, dateFnsLocalizer } from "react-big-calendar";

import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/sass/styles.scss";
import "react-big-calendar/lib/sass/time-grid.scss";

import AddDatePickerEventModal from "./AddDatePickerEventModal";
import AddEventModal from "./AddEventModal";
import EventInfo from "./EventInfo";
import EventInfoModal from "./EventInfoModal";
import OperationsContext from "../context/OperationsContext";
import Toolbar from "./util/Toolbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface IEventInfo extends Event {
  _id: string;
  title: string;
  description?: string;
  start?: Date;
  end?: Date;
  isNew?: boolean;
  isAdded?: boolean;
}

export interface EventFormData {
  description: string;
}

export interface DatePickerEventFormData {
  description: string;
  allDay: boolean;
  start?: Date;
  end?: Date;
}

export const generateId = () =>
  (Math.floor(Math.random() * 10000) + 1).toString();

const initialEventFormState: EventFormData = {
  description: "",
};

const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  allDay: false,
  start: undefined,
  end: undefined,
};

const EventCalendar = () => {
  const { operations, setOperations } = useContext(OperationsContext);
  const { user } = useUser();
  const userId = user?.id;
  const [openSlot, setOpenSlot] = useState(false);
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(
    null
  );

  const [eventInfoModal, setEventInfoModal] = useState(false);

  const [events, setEvents] = useState<IEventInfo[]>([]);
  const [newEvents, setNewEvents] = useState<IEventInfo[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialEventFormState
  );

  const minTime = new Date();
  minTime.setHours(6);
  minTime.setMinutes(0);

  /*   const maxTime = new Date();
  maxTime.setHours(5);
  maxTime.setMinutes(0); */

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData);

  const addNewEvent = (newEvent: IEventInfo) => {
    const test = [...newEvents, { ...newEvent, isAdded: true }];

    setNewEvents(test);
  };

  const addEventToGoogleCalendar = async (eventData: IEventInfo) => {
    try {
      console.log("Adding event to Google Calendar", eventData);
      const response = await fetch("http://localhost:6002/insertEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      //setEvents((prevEvents) => [...prevEvents, result]);
      console.log("Event added to Google Calendar", result);
    } catch (error) {
      console.error("Error sending event data to backend:", error);
    }
  };

  const fetchCalendarEvents = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:6002/getUserCurrentCalendar?clerk_user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const responseEvents = await response.json();
      const transformedEvents = responseEvents.map(
        (event: {
          id: string;
          title: { name: string };
          start: { dateTime: string; date: any };
          end: { dateTime: any; date: any };
          location?: string;
          description?: string;
          url?: string;
          recurring?: boolean;
        }) => ({
          ...event,
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate(),
          description: event.title,
        })
      );
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSelectSlot = (event: Event) => {
    setOpenSlot(true);
    setCurrentEvent(event);
  };

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event);
    setEventInfoModal(true);
  };

  const handleClose = () => {
    setEventFormData(initialEventFormState);
    setOpenSlot(false);
  };

  const handleDatePickerClose = () => {
    setDatePickerEventFormData(initialDatePickerEventFormData);
    setOpenDatepickerModal(false);
  };

  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: IEventInfo = {
      ...eventFormData,
      _id: generateId(),
      title: eventFormData.description,
      start: currentEvent?.start,
      end: currentEvent?.end,
      isNew: true,
    };

    const newEvents = [...events, data];
    setEvents(newEvents);
    events.forEach((event) => {
      console.log(event);
    });

    console.log("New Events:" + newEvents);
    //console.log(newEvents.forEach(addEventToGoogleCalendar));
    handleClose();
  };

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined;
    };

    const setMinToZero = (date: any) => {
      if (date) {
        date.setSeconds(0);
      }
      return date;
    };

    if (datePickerEventFormData.start && datePickerEventFormData.end) {
      const data: IEventInfo = {
        ...datePickerEventFormData,
        _id: generateId(),
        title: datePickerEventFormData.description,
        start: setMinToZero(datePickerEventFormData.start),
        end: datePickerEventFormData.allDay
          ? addHours(datePickerEventFormData.start, 12)
          : setMinToZero(datePickerEventFormData.end),
      };

      const newEvents = [...events, data];

      setEvents(newEvents);
      setDatePickerEventFormData(initialDatePickerEventFormData);
    }
  };

  const onDeleteEvent = () => {
    setEvents(() =>
      [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!)
    );
    setEventInfoModal(false);
  };

  //TODO: Send request to backend and update UI
  const syncToGoogleCalendar = async () => {
    window.confirm("Your calendar has been synced!");
  };

  /*   const convertToGoogleCalendarEvent = (event: IEventInfo) => {
    return {
      summary: event.title,
      location: event.location,
      description: event.description,
      start: {
        dateTime: event.start.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: event.end.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: [
        { email: "
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
  };
 */

  // const convertOperationStringToEvent = (operation: IEventInfo) => {
  //   const [description, start, end] = operation.split(" ");
  //   const data: IEventInfo = {
  //     _id: generateId(),
  //     title: description,
  //     description: description,
  //     start: new Date(start),
  //     end: new Date(end),
  //     isNew: true,
  //   };

  //   return data;
  // };

  useEffect(() => {
    if (userId) {
      fetchCalendarEvents(userId);
    }
    if (operations) {
      console.log(`operation is ${operations}`);
      operations.forEach((operation) => {
        console.log(operation);
        //const convertedOperation = convertOperationStringToEvent(operation);
        addNewEvent(operation);
      });
    }
    // addNewEvent({
    //   _id: "1",
    //   title: "Test Event",
    //   description: "Test Event Description",
    //   start: new Date(),
    //   end: new Date(new Date().setMinutes(new Date().getMinutes() + 180)),
    //   isNew: true,
    // });
  }, [userId, operations]);

  return (
    <Container maxWidth={false} className="h-full">
      <Card>
        <CardHeader
          title="Calendar"
          subheader="Drag and Drop, or use our buttons to add and manage your events and tasks."
        />
        <Divider />
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <ButtonGroup
              size="large"
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                onClick={() => setOpenDatepickerModal(true)}
                size="small"
                variant="contained"
              >
                Add event
              </Button>
            </ButtonGroup>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  newEvents.forEach(addEventToGoogleCalendar);
                  syncToGoogleCalendar();
                }}
                size="small"
                variant="contained"
              >
                Sync to Google Calendar
              </Button>
            </Box>
          </Box>
          <Divider style={{ margin: 10 }} />
          <AddEventModal
            open={openSlot}
            handleClose={handleClose}
            eventFormData={eventFormData}
            setEventFormData={setEventFormData}
            onAddEvent={onAddEvent}
          />
          <AddDatePickerEventModal
            open={openDatepickerModal}
            handleClose={handleDatePickerClose}
            datePickerEventFormData={datePickerEventFormData}
            setDatePickerEventFormData={setDatePickerEventFormData}
            onAddEvent={onAddEventFromDatePicker}
          />
          <EventInfoModal
            open={eventInfoModal}
            handleClose={() => setEventInfoModal(false)}
            onDeleteEvent={onDeleteEvent}
            currentEvent={currentEvent as IEventInfo}
          />
          <Calendar
            localizer={localizer}
            events={[...events, ...newEvents]}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            startAccessor="start"
            components={{
              event: EventInfo,
            }}
            endAccessor="end"
            defaultView="week"
            //min={minTime}
            //max={maxTime}
            eventPropGetter={(event) => {
              let backgroundColor, borderColor;
              if (event.isNew) {
                backgroundColor = "#1976d2";
                borderColor = "#1976d2";
              } else if (event.isAdded) {
                backgroundColor = "#yourColorForAddedEvents";
                borderColor = "#yourColorForAddedEvents";
              } else {
                backgroundColor = "#b64fc8";
                borderColor = "#b64fc8";
              }
              return {
                style: {
                  backgroundColor,
                  borderColor,
                },
              };
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default EventCalendar;
