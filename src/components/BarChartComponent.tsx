import React from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface BarChartComponentProps {
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
    chartHeight: number;
    gapBetweenCategories: number;
    barHeight: number;
    visibleLevels: string[];
    colorMap: Record<string, string>;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
    data,
    chartHeight,
    gapBetweenCategories,
    barHeight,
    visibleLevels,
    colorMap,
}) => {
    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 20, right: 40, left: 30, bottom: 60 }}
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
    );
};

export default BarChartComponent;
