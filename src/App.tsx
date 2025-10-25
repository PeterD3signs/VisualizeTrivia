import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import QuestionsChart from './components/QuestionChart';
import { getCategorySummary, getDifficultyCounts } from './data/apiCall';
import type { Category, GroupedCategory } from './data/categories';

const App: React.FC = () => {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
  const [coreReady, setCoreReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayMode, setDisplayMode] = useState<'difficulty' | 'acceptance'>('difficulty');
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['easy', 'medium', 'hard', 'all']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const groupCategories = (categories: Category[]): GroupedCategory[] => {
    const grouped: Record<string, Category[]> = {};
    categories.forEach((cat) => {
      if (!cat.name) return;
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
    return Object.entries(grouped).map(([title, list]) => ({ title, list }));
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const quick = await getCategorySummary();
        setGroupedCategories(groupCategories(quick));
        setCoreReady(true);

        for (const cat of quick) {
          try {
            const full = await getDifficultyCounts(cat);
            setGroupedCategories(groupCategories(full));
          } catch (e) {
            console.warn(`Second fetch failed for category ${cat.id}:`, e);
          }
        }
      } catch (e) {
        setError(String(e));
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (groupedCategories.length && selectedCategories.length === 0) {
      setSelectedCategories(
        groupedCategories.flatMap(g => g.list.map(c => c.name || ''))
      );
    }
  }, [groupedCategories]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!coreReady) return <div className="loading">Loading...</div>;

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
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <QuestionsChart
          groupCategories={groupedCategories}
          displayMode={displayMode}
          selectedLevels={selectedLevels}
          selectedCategories={selectedCategories}
        />
      </div>
    </div>
  );
};

export default App;
