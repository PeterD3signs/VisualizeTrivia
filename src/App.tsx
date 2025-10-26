import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import { getCategorySummary, modifyDifficultyCounts } from './data/apiCall';
import type { Category, GroupedCategory } from './data/categories';
import TriviaGroupedBarChart from './components/TriviaBarChart';
import LoadingSpinner from './components/LoadingSpinner';
import "./App.css"

const App: React.FC = () => {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);  //categories dynamically grouped by their type (default: "general", "science", "entertainment")
  const [displayedCategories, setDisplayedCategories] = useState<Set<number>>(new Set());  //should this category be displayed on the graph?
  const [coreReady, setCoreReady] = useState(false);  //to see if loading of core API data is complete (see apiCall.ts)
  const [error, setError] = useState<string | null>(null); //to display potential breaking errors (non-essential errors are handled in each function)
  const [barHeight, setBarHeight] = useState(15); // Default height
  const [displayMode, setDisplayMode] = useState<'difficulty' | 'acceptance'>('acceptance');  //should the chart show the question count devided by their difficulty or by their acceptance status
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['pending', 'verified', 'rejected', 'sum']); //question difficulty / acceptance levels
  const [darkMode, setDarkMode] = useState(false);

  // Group the categories based on their type: (accepts all categories in one array; each category is eihther "General" or has a prefix with its type)
  const groupCategories = (categories: Category[]): GroupedCategory[] => {
    const grouped: Record<string, Category[]> = {};
    categories.forEach((cat) => {
      if (!cat.name) return;  //if the category does not have a name, it is better to skip it
      if (cat.name == "All") return;  //the "all" category will be grupped separatelly

      let title = "General";
      let displayName = cat.name;
      if (cat.name.includes(":")) {
        const parts = cat.name.split(":");
        title = parts[0].trim();
        displayName = parts[1].trim();
      }

      if (!grouped[title]) grouped[title] = [];
      grouped[title].push({ ...cat, name: displayName });

    });

    //return the Object as a GroupedCategory array:
    return Object.entries(grouped).map(([title, list]) => ({ title, list }));
  };


  //dynamically calculate necessary values and update the UI (this only runs on):
  useEffect(() => {
    async function fetchCategories() {
      try {

        const quick = await getCategorySummary(); //load core data
        setGroupedCategories(groupCategories(quick));
        setDisplayedCategories(new Set(quick.map(cat => cat.id)));
        setCoreReady(true); //update to no longer show "loading..."

        for (const cat of quick.slice(0, -1)) {  //dynamically load additional data that takes longer to fetch from the API (categorie "ALL" excluded)
          try {
            const updatedCounts = await modifyDifficultyCounts(cat);
            setGroupedCategories(prev =>
              prev.map(group => ({
                ...group,
                list: group.list.map(c =>
                  c.id === cat.id ? { ...c, ...updatedCounts } : c
                ),
              }))
            );
          } catch (e) { //If any errors are detected it is important to not break the function. At this point the core data is succesfully loaded.
            console.warn(`Second fetch failed for category ${cat.id}:`, e);
          }
        }
      } catch (e) { //display the braking error
        setError(String(e));
      }
    }

    fetchCategories();
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  if (error) return <div className="error">Breaking error: {error}</div>;

  return (
    <div>
      <Header />

      <div className="main-content">
        <Filters
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          selectedLevels={selectedLevels}
          setSelectedLevels={setSelectedLevels}
          groupedCategories={groupedCategories}
          setDisplayedCategories={setDisplayedCategories}
          displayedCategories={displayedCategories}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setBarHeight={setBarHeight}
          barHeight={barHeight}
        />
        {coreReady ?
          <TriviaGroupedBarChart
            groupedCategories={groupedCategories}
            displayedCategories={displayedCategories}
            displayMode={displayMode}
            selectedLevels={selectedLevels}
            barHeight={barHeight}
          />
          :
          <LoadingSpinner />
        }
      </div>
    </div>
  );
};

export default App;
