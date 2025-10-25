//{TODO: Safe delete}

import { useEffect, useState } from "react";
import { getCategorySummary, getDifficultyCounts } from "../data/apiCall";
import type { Category } from "../data/categories";

type GroupedCategory = {
    title: string;
    list: Category[];
};

export default function CategoryList() {
    const [error, setError] = useState<string | null>(null);
    const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
    const [coreReady, setCoreReady] = useState<boolean>(false);

    // Group categories into separate arrays by type
    const groupCategories = (categories: Category[]): GroupedCategory[] => {
        const grouped: Record<string, Category[]> = {};

        categories.forEach((cat) => {
            if (!cat.name) return;

            // Determine group title from prefix before ':' or default to "General"
            let title = "General";
            let displayName = cat.name;

            if (cat.name.includes(":")) {
                const parts = cat.name.split(":");
                title = parts[0].trim();
                displayName = parts[1].trim();
            }

            // Initialize group array if needed
            if (!grouped[title]) grouped[title] = [];

            // Add category to the group
            grouped[title].push({ ...cat, name: displayName });
        });

        // Convert grouped object to array with title + list
        return Object.entries(grouped).map(([title, list]) => ({ title, list }));
    };

    // Fetch categories on mount
    useEffect(() => {
        async function fetchCategories() {
            try {
                // First fetch: quick data
                const quick = await getCategorySummary();
                setGroupedCategories(groupCategories(quick)); // update state for UI
                setCoreReady(true);

                // Second fetch: long data (only if quick succeeded)
                for (const cat of quick) {
                    try {
                        const full = await getDifficultyCounts(cat);
                        setGroupedCategories(groupCategories(full));
                    } catch (e) {
                        console.warn(`Second fetch failed for category ${cat.id}:`, e);
                    }
                }
                console.log("finalizedTheFullVersion");

            } catch (e) {
                // First fetch failed
                setError(String(e));
            }
        }

        fetchCategories();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!coreReady) return <div>Loading...</div>;

    // 
    return (
        <div>
            {groupedCategories.map(({ title, list }) => (
                <div key={title}>
                    <h2>{title}</h2>
                    <ul>
                        {list.map((cat) => (
                            <li key={cat.id}>
                                {cat.id} {cat.name} {cat.total_num_of_questions ?? ""} {cat.total_num_of_pending_questions ?? ""} {cat.total_easy_question_count ?? ""} {cat.total_hard_question_count ?? ""}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
