import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import Footer from './components/Footer';
import { getCategorySummary, modifyDifficultyCounts } from './data/apiCall';
import type { Category, GroupedCategory } from './data/categories';
import TriviaCharts from './components/TriviaCharts';
import LoadingSpinner from './components/LoadingSpinner';
import "./App.css"

const App: React.FC = () => {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);  //categories dynamically grouped by their type (default: "general", "science", "entertainment")
  const [displayedCategories, setDisplayedCategories] = useState<Set<number>>(new Set());  //should this category be displayed on the graph?
  const [coreReady, setCoreReady] = useState(false);  //to see if loading of core API data is complete (see apiCall.ts)
  const [error, setError] = useState<string | null>(null); //to display potential breaking errors (non-essential errors are handled in each function)
  const [pieChart, setPieChart] = useState(false);  //Display a standard chart or a Pie chart?
  const [barHeight, setBarHeight] = useState(15); // Default height
  const [displayMode, setDisplayMode] = useState<'difficulty' | 'acceptance'>('acceptance');  //should the chart show the question count devided by their difficulty or by their acceptance status
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['pending', 'verified', 'rejected', 'sum']); //question difficulty / acceptance levels
  const [darkMode, setDarkMode] = useState(false);
  const [winWidth, setWinWidth] = useState(window.innerWidth);  //window width
  const [filtersExtended, setFiltersExtended] = useState(false);

  const mobileWidth = 800;
  const mobileMode = useMemo(() => {
    return (winWidth < mobileWidth);
  }, [winWidth, mobileWidth])

  // Group the categories based on their type: (accepts all categories in one array; each category is eihther "General" or has a prefix with its type)
  const groupCategories = (categories: Category[]): GroupedCategory[] => {
    const grouped: Record<string, Category[]> = {};
    categories.forEach((cat) => {
      if (!cat.name) return;  //if the category does not have a name, it is better to skip it

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

        for (const cat of quick) {  //dynamically load additional data that takes longer to fetch from the API
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

    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, []);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  if (error) return <div className="error">Breaking error: {error}</div>;

  return (
    <div>
      <Header
        mobileMode={mobileMode}
      />
      {mobileMode && <Filters
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
        pieChart={pieChart}
        setPieChart={setPieChart}
        mobileMode={mobileMode}
        filtersExtended={filtersExtended}
      />}
      {mobileMode &&
        <div className="extend-button-wrapper">
          <button className="extend-filters-button" onClick={() => setFiltersExtended(!filtersExtended)}>
            {filtersExtended ? "△ hide filters △" : "▽ show filters ▽"}
          </button>
        </div>}
      <div className="main-content">
        {!mobileMode && <Filters
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
          pieChart={pieChart}
          setPieChart={setPieChart}
          mobileMode={mobileMode}
          filtersExtended={filtersExtended}
        />}
        {coreReady ?
          <TriviaCharts
            groupedCategories={groupedCategories}
            displayedCategories={displayedCategories}
            displayMode={displayMode}
            selectedLevels={selectedLevels}
            barHeight={barHeight}
            pieChart={pieChart}
            mobileMode={mobileMode}
          />
          :
          <LoadingSpinner />
        }

      </div>
      <Footer
        mobileMode={mobileMode}
      />
    </div>
  );
};

export default App;
