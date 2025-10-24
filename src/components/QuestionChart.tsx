import { useEffect, useState } from "react";
import { fetchQuestions } from "../opentdbApi/apiCall.ts";
import type { Question } from "../opentdbApi/apiCall.ts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function QuestionChart() {
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    fetchQuestions(20).then((questions: Question[]) => {
      const counts: Record<string, number> = {};
      questions.forEach((q) => {
        counts[q.category] = (counts[q.category] || 0) + 1;
      });

      const formattedData = Object.entries(counts).map(([name, count]) => ({ name, count }));
      setChartData(formattedData);
    });
  }, []);

  return (
    <div>
      <h2>Trivia Questions by Category</h2>
      <BarChart width={600} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
