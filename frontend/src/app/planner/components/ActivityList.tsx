"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import EventCard from "./EventCard"


const ActivityList = () =>{
  const [events, setEvents] = useState([
    {
      title: "Push Day",
      start: new Date("2011-10-10T14:48:00"),
      end: new Date("2011-10-10T14:48:00")
    },
    {
      title: "Push Day",
      description: "Push day at 24hr Fitness",
      start: new Date("2011-10-10T14:48:00"),
      end: new Date("2011-10-10T14:48:00")
    },
    {
      title: "Push Day",
      description: "Push day at 24hr Fitness",
    },
  ])

  return (
    <div className="App rounded-lg">
      <div className="rounded-lg" style={{ position: "relative", width: "100%", height: 900 }}>
        <MainContainer>
          <ChatContainer>
            <MessageList scrollBehavior="smooth">
              {events.map((event, i) => {
                return (
                  <EventCard 
                    title={event.title}
                    description={event.description}
                    startTime={event.start}
                    endTime={event.end}
                    >
                  </EventCard>
                );
              })}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ActivityList;