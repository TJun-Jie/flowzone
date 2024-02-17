"use client";

import moment, { locale } from "moment-timezone";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import OpenAI from "openai";
import { DateTime } from "luxon";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  MessageTextContent,
  MessageHtmlContent,
  MessageGroupHeader,
} from "@chatscope/chat-ui-kit-react";

import OperationsContext from "../context/OperationsContext";
import { generateId } from "./EventCalendar";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

interface IEventInfo extends Event {
  _id: string;
  title: string;
  description?: string;
  start?: Date;
  end?: Date;
  isNew?: boolean;
}
const Chat = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm your calendar assistant! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { operations, setOperations } = useContext(OperationsContext);
  const { user } = useUser();
  const userId = user?.id;
  interface IEventInfo extends Event {
    _id: string;
    title: string;
    description?: string;
    // todo might be wrong
    start?: Date;
    end?: Date;
    isNew?: boolean;
  }

  const handleSendRequest = async (message: string) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    setMessages((prevMessages: any) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      // const content = response.choices[0]?.message?.content;
      const content = response;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages: any) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages: any) {
    const apiMessages = chatMessages.map((messageObject: any) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const completion = await openai.chat.completions.create(apiRequestBody);

    return completion.choices[0].message.content;
  }

  const sendPromptToBackend = async (userId: string, chatMessages: any) => {
    try {
      const newMessage = {
        message: chatMessages,
        direction: "outgoing",
        sender: "user",
      };
      setMessages((prevMessages: any) => [...prevMessages, newMessage]);
      setIsTyping(true);
      const response = await fetch("http://localhost:6002/getChatResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const operations = data.amendedUserCalendarObj;
      const thirdPartyEvents = data.thirdPartyEvents;
      console.log("Third Party Events:", thirdPartyEvents);
      let transformedThirdPartyEventsArray: IEventInfo[] = [];
      if (thirdPartyEvents) {
        const gptResponse = data.response;
        if (gptResponse) {
          const chatGPTResponse = {
            message: gptResponse,
            sender: "ChatGPT",
          };
          setMessages((prevMessages: any) => [
            ...prevMessages,
            chatGPTResponse,
          ]);
        }
        const transformedThirdPartyEventsArray: IEventInfo[] =
          thirdPartyEvents.map((thirdPartyEvent: any) => {
            return {
              _id: generateId(),
              title: thirdPartyEvent.summary,
              description: thirdPartyEvent.summary,
              start: moment(thirdPartyEvent.start.dateTime).toDate(),
              end: moment(thirdPartyEvent.end.dateTime).toDate(),
            };
          });
        setOperations(transformedThirdPartyEventsArray);

        transformedThirdPartyEventsArray.forEach((event) => {
          const gptResponse =
            event.description +
            " added to your calendar" +
            event.start +
            " to " +
            event.end;
          console.log(gptResponse);
          if (gptResponse) {
            const chatGPTResponse = {
              message: gptResponse,
              sender: "ChatGPT",
            };
            setMessages((prevMessages: any) => [
              ...prevMessages,
              chatGPTResponse,
            ]);
          }
        });
        console.log("Third Party Events:", transformedThirdPartyEventsArray);
      }

      const operationsArray: IEventInfo[] = JSON.parse(operations);
      const operationsArrayWithId: IEventInfo[] = operationsArray.map(
        (operation, index) => {
          console.log(operation.start);
          console.log(operation.end);
          let startMoment = moment.utc(operation.start);
          let endMoment = moment.utc(operation.end);

          // Instead of subtracting the timezone offset, directly manipulate the hours to "keep" the time
          // This part is assuming you want to adjust the time to appear the same as if it were in the local timezone
          // without actually converting it to the local timezone.
          startMoment.add(moment().utcOffset(), "minutes");
          endMoment.add(moment().utcOffset(), "minutes");

          console.log("Start Moment:", startMoment);
          console.log("End Moment:", endMoment);

          let startDateTime = DateTime.fromISO(operation.start ?? "", {
            zone: "utc",
          });
          let endDateTime = DateTime.fromISO(operation.end ?? "", {
            zone: "utc",
          });

          // Adjust to keep the same "wall clock" time but in the local timezone
          // This effectively changes the zone without changing the local time
          let localStart = startDateTime.setZone("local", {
            keepLocalTime: true,
          });
          let localEnd = endDateTime.setZone("local", { keepLocalTime: true });

          console.log(localStart);
          console.log(localEnd);

          return {
            ...operation,
            _id: generateId(),
            start: localStart.toJSDate(),
            end: localEnd.toJSDate(),
          };
        }
      );

      setOperations(operationsArrayWithId);
      // const combinedOperations = [
      //   ...transformedThirdPartyEventsArray,
      //   ...operationsArrayWithId,
      // ];
      // setOperations(combinedOperations);
      const gptResponse = data.response;
      if (gptResponse) {
        const chatGPTResponse = {
          message: gptResponse,
          sender: "ChatGPT",
        };
        setMessages((prevMessages: any) => [...prevMessages, chatGPTResponse]);
      }
      return operationsArrayWithId.toString();
    } catch (error) {
      console.error("Error sending prompt to backend:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <MainContainer
      style={{ borderRadius: "5px", height: "calc(100vh - 56px)" }}
    >
      <ChatContainer style={{ paddingBottom: "10px", paddingTop: "10px" }}>
        <MessageList
          scrollBehavior="smooth"
          typingIndicator={
            isTyping ? <TypingIndicator content="Calendare is typing" /> : null
          }
        >
          {messages.map((message, i) => {
            const direction =
              message.sender === "ChatGPT" ? "incoming" : "outgoing";
            const color = message.sender === "ChatGPT" ? "black" : "white";
            return (
              <>
                <Message
                  key={i}
                  model={{ ...message, direction, position: "normal" }}
                ></Message>
              </>
            );
          })}
        </MessageList>
        <MessageInput
          placeholder="Send a Message"
          onSend={sendPromptToBackend}
          style={{ paddingTop: "10px" }}
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default Chat;
