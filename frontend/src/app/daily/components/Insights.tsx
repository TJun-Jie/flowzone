import { useQuery } from "convex/react";

interface Insights {
  id: number;
  content: string[];
}

const Insights = () => {
  const insightsVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const insights = useQuery(api.getInsights);

  return (
    <div>
      <h1>Insights</h1>
    </div>
  );
}

export default Insights;