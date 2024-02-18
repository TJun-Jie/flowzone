import React from "react";

import { IEventInfo } from "../components/EventCalendar";

type OperationsContextType = {
  operations: IEventInfo[] | null;
  setOperations: (operations: IEventInfo[]| null) => void;
};

const OperationsContext = React.createContext<OperationsContextType>({
  operations: null,
  setOperations: () => {},
});

export default OperationsContext;
