import { useEffect, useState } from "react";
import { getCategorySummary } from "../opentdbApi/apiCall";
import type { Category } from "../opentdbApi/apiCall";

type GroupedCategory = {
  title: string;
  list: Category[];
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    getCategorySummary()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!categories.length) return <div>Loading...</div>;

  const groupedCategories = groupCategories(categories);

  return (
    <div>
      {groupedCategories.map(({ title, list }) => (
        <div key={title}>
          <h2>{title}</h2>
          <ul>
            {list.map((cat) => (
              <li key={cat.id}>
                {cat.name} {cat.total_num_of_questions ?? ""}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
