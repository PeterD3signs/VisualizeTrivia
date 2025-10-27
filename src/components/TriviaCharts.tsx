import React, { useMemo } from "react";
import BarChartComponent from "./BarChartComponent";
import PieChartComponent from "./PieChartComponent";
import "./componentStyles/TriviaCharts.css";
import type { GroupedCategory } from "../data/categories";

interface Props {
    groupedCategories: GroupedCategory[];
    displayedCategories: Set<number>; // updated to Set
    displayMode: "difficulty" | "acceptance";
    selectedLevels: string[];
    barHeight: number;
    pieChart: boolean;
    mobileMode: boolean;
}

const TriviaCharts: React.FC<Props> = ({
    groupedCategories,
    displayedCategories,
    displayMode,
    selectedLevels,
    barHeight,
    pieChart,
    mobileMode
}) => {

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
    const chartHeight: number = useMemo(() => { return Math.max(data.length * visibleLevels.length * barHeight + data.length * gapBetweenCategories, 400); }, [data, barHeight, gapBetweenCategories, visibleLevels]);

    const colorMap: Record<string, string> = {
        pending: "var(--color-accent)",
        verified: "var(--color-primary)",
        rejected: "var(--color-title)",
        sum: "var(--color-sum-bar)",
        easy: "var(--color-accent)",
        medium: "var(--color-primary)",
        hard: "var(--color-title)",
    };

    if (pieChart) {
        return (
            <div className="trivia-bar-chart">
                <h2>Share of questions in selected categories:</h2>
                <PieChartComponent
                    data={data}
                    colorMap={colorMap}
                    visibleLevels={visibleLevels}
                />
            </div>);
    } else {
        return (
            <div className="trivia-bar-chart">
                <h2 className={`${mobileMode ? "mobile-title" : ""}`}>Number of questions per category:</h2>
                <BarChartComponent
                    data={data}
                    chartHeight={chartHeight}
                    gapBetweenCategories={gapBetweenCategories}
                    barHeight={barHeight}
                    visibleLevels={visibleLevels}
                    colorMap={colorMap}
                    mobileMode={mobileMode}
                />
            </div>
        );
    }
};

export default TriviaCharts;
