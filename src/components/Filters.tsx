import React from 'react';
import './componentStyles/Filters.css';
import type { DisplayedCategory, GroupedCategory } from '../data/categories';

interface Props {
    selectedLevels: string[];   //difficulty levels / acceptance levels - 'easy', 'medium', 'hard', 'all' / 'pending', 'verified', 'rejected', 'all'.
    displayMode: 'difficulty' | 'acceptance';
    groupCategories: GroupedCategory[];
    displayedCategories: DisplayedCategory[];
    darkMode: boolean;
    setDisplayMode: (mode: 'difficulty' | 'acceptance') => void;
    setSelectedLevels: React.Dispatch<React.SetStateAction<string[]>>;
    setDisplayedCategories: React.Dispatch<React.SetStateAction<DisplayedCategory[]>>;
    changeCategorySelection: (prevState: DisplayedCategory[], IdOfCatToChange: number) => DisplayedCategory[];
    setDarkMode: (value: boolean) => void;
}

const Filters: React.FC<Props> = ({
    displayMode,
    setDisplayMode,
    selectedLevels,
    setSelectedLevels,
    groupCategories,
    setDisplayedCategories,
    displayedCategories,
    changeCategorySelection,
    darkMode,
    setDarkMode,
}) => {
    const toggleLevel = (level: string) => {    //add or delete a given difficulty level.
        setSelectedLevels(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    return (
        <div className="filters">
            <div className="filters-section">
                <span>Mode:</span>
                <button className="filters-button" onClick={() => setDisplayMode(displayMode === 'difficulty' ? 'acceptance' : 'difficulty')}>
                    {displayMode === 'difficulty' ? 'Difficulty' : 'Acceptance'}
                </button>
            </div>

            <div className="filters-section">
                {['easy', 'medium', 'hard', 'all'].map(level => (
                    <label key={level} className="filters-checkbox-label">
                        <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => toggleLevel(level)}
                        />
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                ))}
            </div>

            <div className="filters-section">
                {groupCategories.map(group => (
                    <div key={group.title} className="filters-group">
                        <span className="filters-group-title">{group.title}</span>
                        {group.list.map(cat => {
                            // Find the matching category in the flat displayedCategories array
                            const displayedCat = displayedCategories.find(dc => dc.id === cat.id);
                            const isChecked = displayedCat?.display ?? true; // default to true if not found

                            return (
                                <label key={cat.id} className="filters-checkbox-label">
                                    <span>{cat.name} {cat.id}</span>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                            setDisplayedCategories(prev =>
                                                changeCategorySelection(prev, cat.id)
                                            );
                                        }}
                                    />
                                </label>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="filters-section dark-mode-toggle">
                <span>Dark Mode</span>
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>
        </div>
    );
};

export default Filters;
