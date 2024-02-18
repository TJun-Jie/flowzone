'use client'
import DayViewCalendar from "../dayView/Combined";
import ActionItemPage from "../actionitem/page";
import Insights from "../daily/components/Insights";

const Home = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div >
          <ActionItemPage />
        </div>
        <div>
          <DayViewCalendar />
        </div>
        <div>
          <Insights />
        </div>
      </div>
    </div>
  );
}

export default Home;