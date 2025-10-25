import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import { getCategorySummary, getDifficultyCounts } from './data/apiCall';
import type { Category, GroupedCategory, DisplayedCategory } from './data/categories';

const App: React.FC = () => {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);  //categories dynamically grouped by their type (default: "general", "science", "entertainment")
  const [displayedCategories, setDisplayedCategories] = useState<DisplayedCategory[]>([]);  //should this category be displayed on the graph?
  const [coreReady, setCoreReady] = useState(false);  //to see if loading of core API data is complete (see apiCall.ts)
  const [error, setError] = useState<string | null>(null); //to display potential breaking errors (non-essential errors are handled in each function)

  const [displayMode, setDisplayMode] = useState<'difficulty' | 'acceptance'>('difficulty');  //should the chart show the question count devided by their difficulty or by their acceptance status
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['easy', 'medium', 'hard', 'all']); //question difficulty / acceptance levels - alternative: 'pending', 'verified', 'rejected', 'all'.
  const [darkMode, setDarkMode] = useState(false); // TODO

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
    return Object.entries(grouped).map(([title, list]) => ({title, list}));
  };

  const changeCategorySelection = ((prevState: DisplayedCategory[], IdOfCatToChange: number): DisplayedCategory[] => {
    //iterate over categories (cat) -> if cat.id === IdOfCatToChange -> change its boolean value
    return prevState.map(cat =>
      cat.id === IdOfCatToChange
        ? { ...cat, display: !cat.display } // toggle only the matching category
        : cat // keep the rest unchanged
    );
  });

  //dynamically calculate necessary values and update the UI (this only runs on):
  useEffect(() => {
    async function fetchCategories() {
      try {

        const quick = await getCategorySummary(); //load core data
        setGroupedCategories(groupCategories(quick));
        setDisplayedCategories( //set up which categories should be displayed on the chart
          quick.map(cat => ({
            id: cat.id,
            display: true, // default value
          }))
        );
        setCoreReady(true); //update to no longer show "loading..."

        for (const cat of quick) {  //dynamically load additional data that takes longer to fetch from the API 
          try {
            const full = await getDifficultyCounts(cat);
            setGroupedCategories(groupCategories(full));
          } catch (e) { //If any errors are detected it is important to not break the function. At this point the core data is succesfully loaded.
            console.warn(`Second fetch failed for category ${cat.id}:`, e);
          }
        }
      } catch (e) { //display the braking error
        setError(String(e));
      }
    }
    fetchCategories();
  }, []);

  //TODO: React to filter changes

  if (error) return <div className="error">Error: {error}</div>;  //TODO: make this display fallback data
  if (!coreReady) return <div className="loading">Loading...</div>;   //TODO: make this be part of the chart only - some parts of the UI can be displayed ealier to make the user feel like things are already happenign

  //TODO: check styles
  //TODO: add about
  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <Header />
      <div className="main-content">
        <Filters
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          selectedLevels={selectedLevels}
          setSelectedLevels={setSelectedLevels}
          groupCategories={groupedCategories}
          setDisplayedCategories={setDisplayedCategories}
          changeCategorySelection={changeCategorySelection}
          displayedCategories={displayedCategories}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    </div>
  );
};

export default App;
