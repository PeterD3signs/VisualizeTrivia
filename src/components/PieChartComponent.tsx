import React from "react";
import { useMemo } from "react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface PieChartComponentProps {
    data: {
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
    }[];
    colorMap: Record<string, string>;
    visibleLevels: string[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
    data,
    colorMap,
    visibleLevels
}) => {
    const cumulativeData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Initialize sums
        let pending = 0;
        let verified = 0;
        let rejected = 0;
        let easy = 0;
        let medium = 0;
        let hard = 0;

        // Sum up all rows
        for (const row of data) {
            pending += row.pending ?? 0;
            verified += row.verified ?? 0;
            rejected += row.rejected ?? 0;
            easy += row.easy ?? 0;
            medium += row.medium ?? 0;
            hard += row.hard ?? 0;
        }

        // Build array for PieChart
        const result: { name: string; value: number }[] = [];
        if (pending && visibleLevels.includes("pending")) result.push({ name: "pending", value: pending });
        if (verified && visibleLevels.includes("verified")) result.push({ name: "verified", value: verified });
        if (rejected && visibleLevels.includes("rejected")) result.push({ name: "rejected", value: rejected });
        if (easy && visibleLevels.includes("easy")) result.push({ name: "easy", value: easy });
        if (medium && visibleLevels.includes("medium")) result.push({ name: "medium", value: medium });
        if (hard && visibleLevels.includes("hard")) result.push({ name: "hard", value: hard });

        return result;
    }, [data, visibleLevels]); // recalc only when these change

    const total = cumulativeData.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={cumulativeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                    isAnimationActive={true}
                    innerRadius={80}
                >
                    {cumulativeData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={colorMap[entry.name]}
                        />
                    ))}
                </Pie>

                <Tooltip
                    contentStyle={{
                        background: "var(--color-bg)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-second-bg)",
                    }}
                />
                {total !== 0 &&
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "1rem", fill: "var(--color-primary)", fontWeight: "bold"}}
                    >
                        total: {total}
                    </text>
                }
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartComponent;
