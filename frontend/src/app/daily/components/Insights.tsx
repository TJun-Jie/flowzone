import { useQuery } from "convex/react";
import { motion } from "framer-motion";

import { api } from "../convex/_generated/api";


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
      <motion.div
        initial="initial"
        animate="in"
        variants={insightsVariants}
        transition={pageTransition}
      >
        <h2 className="text-xl font-bold">Insights</h2>
        {insights.isLoading && <p>Loading...</p>}
        {insights.error && <p>Error: {insights.error.message}</p>}
        {insights.data && (
          <div>
            {insights.data.map((insight: Insights) => (
              <div key={insight.id}>
                <h3>Insight {insight.id}</h3>
                <ul>
                  {insight.content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Insights;