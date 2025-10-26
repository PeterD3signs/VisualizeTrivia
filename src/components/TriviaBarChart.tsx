import React, { useMemo, useRef} from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import "./componentStyles/TriviaBarChart.css";
import type { GroupedCategory } from "../data/categories";

interface Props {
  groupedCategories: GroupedCategory[];
  displayedCategories: Set<number>; // updated to Set
  displayMode: "difficulty" | "acceptance";
  selectedLevels: string[];
  barHeight: number;
}

const TriviaGroupedBarChart: React.FC<Props> = ({
  groupedCategories,
  displayedCategories,
  displayMode,
  selectedLevels,
  barHeight
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Prepare data for the chart
  const data = useMemo(() => {
    const rows: {
      id: number;
      categoryName: string;
      groupTitle: string;
      pending?: number;
      verified?: number;
      rejected?: number;
      sum?: number;
      easy?: number;
      medium?: number;
      hard?: number;
    }[] = [];

    for (const group of groupedCategories) {
      for (const c of group.list) {
        if (!displayedCategories.has(c.id)) continue;

        rows.push({
          id: c.id,
          categoryName: c.name ?? "Unnamed",
          groupTitle: group.title,
          pending: c.total_num_of_pending_questions ?? 0,
          verified: c.total_num_of_verified_questions ?? 0,
          rejected: c.total_num_of_rejected_questions ?? 0,
          sum: displayMode === "acceptance" ? (c.total_num_of_pending_questions ?? 0) + (c.total_num_of_verified_questions ?? 0) + (c.total_num_of_rejected_questions ?? 0) : (c.total_num_of_verified_questions ?? 0),
          easy: c.total_easy_question_count ?? 0,
          medium: c.total_medium_question_count ?? 0,
          hard: c.total_hard_question_count ?? 0,
        });
      }
    }

    return rows;
  }, [groupedCategories, displayedCategories, displayMode]);


  // Determine which bars to display
  const levels =
    displayMode === "acceptance"
      ? ["pending", "verified", "rejected", "sum"]
      : ["easy", "medium", "hard", "sum"];

  const visibleLevels = levels.filter((l) => selectedLevels.includes(l));

  const gapBetweenCategories = 20;
  const chartHeight = useMemo(() => {return data.length * visibleLevels.length * barHeight + data.length * gapBetweenCategories;}, [data, barHeight, gapBetweenCategories, visibleLevels]);

  const colorMap: Record<string, string> = {
    pending: "var(--color-accent)",
    verified: "var(--color-primary)",
    rejected: "var(--color-title)",
    sum: "var(--color-sum-bar)",
    easy: "var(--color-accent)",
    medium: "var(--color-primary)",
    hard: "var(--color-title)",
  };

  return (
    <div className="trivia-bar-chart" ref={containerRef}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 30, right: 40, left: 30, bottom: 30 }}
          barGap={0}
          barCategoryGap={gapBetweenCategories}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-second-bg)" />
          <XAxis
            type="number"
            tick={{ fill: "var(--color-text)" }}
            label={{
              value: "Number of questions",
              position: "bottom",
              fill: "var(--color-text)",
            }}
            
          />
          <YAxis
            dataKey="categoryName"
            type="category"
            tick={{ fill: "var(--color-text)" }}
            width={110}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-second-bg)",
            }}
          />
          <Legend
          align="right"
          verticalAlign="top"

          />
          {visibleLevels.map((lvl) => (
            <Bar
              key={lvl}
              dataKey={lvl}
              fill={colorMap[lvl]}
              barSize={barHeight}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TriviaGroupedBarChart;
