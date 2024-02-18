import Insights from "./Insights";
import HealthChart from "./HealthChart";

const InsightsPage = () => {
  return (
    <div className="flex">
      <div className="w-1/2 px-4">
        <HealthChart />
      </div>
      <div className="w-1/2 px-4">
        <Insights />
      </div>
    </div>
  );
};