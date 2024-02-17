import { Navigate } from "react-big-calendar";
import moment from "moment";

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate(Navigate.NEXT);
  };

  const goToCurrent = () => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate(Navigate.TODAY);
  };

  const label = () => {
    const date = moment(toolbar.date);
    return <span>{date.format("MMMM YYYY")}</span>;
  };

  return (
    <div>
      <button onClick={goToBack}>Back</button>
      <button onClick={goToCurrent}>Current</button>
      <button onClick={goToNext}>Next</button>
      <label>{label()}</label>
      <button onClick={() => toolbar.onView("month")}>Month</button>
      <button onClick={() => toolbar.onView("week")}>Week</button>
      <button onClick={() => toolbar.onView("day")}>Day</button>
      <button onClick={() => toolbar.onView("agenda")}>Agenda</button>
    </div>
  );
};

export default CustomToolbar;
