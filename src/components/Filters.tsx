import React from 'react';
import './compontStyles/Filters.css';
import type { GroupedCategory } from '../data/categories';

interface Props {
    displayMode: 'difficulty' | 'acceptance';
    setDisplayMode: (mode: 'difficulty' | 'acceptance') => void;
    selectedLevels: string[];   //difficulty levels / acceptance levels - 'easy', 'medium', 'hard', 'all' / 'pending', 'verified', 'rejected', 'all'.
    setSelectedLevels: React.Dispatch<React.SetStateAction<string[]>>;
    groupCategories: GroupedCategory[];
    setGroupedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const Filters: React.FC<Props> = ({
    displayMode,
    setDisplayMode,
    selectedLevels,
    setSelectedLevels,
    groupCategories,
    setGroupedCategories,
    darkMode,
    setDarkMode,
}) => {
    const toggleLevel = (level: string) => {    //add or delete a given difficulty level.
        setSelectedLevels(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    const toggleCategory = (category: string) => {
        //TODO!
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
                        {group.list.map(cat => (
                            <label key={cat.name} className="filters-checkbox-label">
                                <span>{cat.name}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(cat.name || '')}
                                    onChange={() => toggleCategory(cat.name || '')}
                                />
                            </label>
                        ))}
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
