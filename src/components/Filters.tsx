import React from 'react';
import './componentStyles/Filters.css';
import type { DisplayedCategory, GroupedCategory } from '../data/categories';

interface Props {
    selectedLevels: string[];   //difficulty levels / acceptance levels - 'easy', 'medium', 'hard', 'sum' / 'pending', 'verified', 'rejected', 'sum'.
    displayMode: 'difficulty' | 'acceptance';
    groupedCategories: GroupedCategory[];
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
    groupedCategories,
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

            {/* visualize question difficulty or question acceptance status */}
            <div className="dividing-line"></div>
            <p><b>PLOT QUESTIONS BY:</b></p>

            <div className="data-type-toggle">
                <p className={`${displayMode === "acceptance" ? "toggle-p" : ""}`} >Acceptance</p>
                <button className="toggle-button" onClick={() => setDisplayMode(displayMode === "difficulty" ? "acceptance" : "difficulty")}>
                    <div className={`toggle-circle ${displayMode === "difficulty" ? "selected" : ""}`}></div>
                </button>
                <p className={`${displayMode === "difficulty" ? "toggle-p" : ""}`}>Difficulty</p>
            </div>
            <div className="dividing-line additional-top-margin"></div>

            {/* 'easy', 'medium', 'hard', 'sum' / 'pending', 'verified', 'rejected', 'sum'. */}
            {displayMode === "difficulty" ?
                <div>
                    <p><b>DISPLAY DIFFICULTIES:</b></p>
                </div>
                :
                <div>
                    <p><b>DISPLAY ACCEPTANCE:</b></p>
                </div>
            }
            <div className="filters-section">
                {(
                    displayMode === "difficulty"
                        ? ["easy", "medium", "hard", "sum"]
                        : ["pending", "verified", "rejected", "sum"]
                ).map(level => (
                    <label key={level} className="filters-checkbox-label">
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                        <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => toggleLevel(level)}
                        />

                    </label>
                ))}
            </div>
            {/* Select / Deselect All Button */}
            <div className="filters-text-button-wrapper">
                <button
                    className="filters-text-button"
                    onClick={() => {
                        if (displayMode === "difficulty") {
                            const allSelected = ["easy", "medium", "hard", "sum"].every(level =>
                                selectedLevels.includes(level)
                            );
                            if (allSelected) {
                                // Deselect all
                                toggleLevel("easy");
                                toggleLevel("medium");
                                toggleLevel("hard");
                                toggleLevel("sum");
                            } else {
                                // Select all
                                if (!selectedLevels.includes("easy")) { toggleLevel("easy") };
                                if (!selectedLevels.includes("medium")) { toggleLevel("medium") };
                                if (!selectedLevels.includes("hard")) { toggleLevel("hard") };
                                if (!selectedLevels.includes("sum")) { toggleLevel("sum") };
                            }
                        } else {
                            const allSelected = ["pending", "verified", "rejected", "sum"].every(level =>
                                selectedLevels.includes(level)
                            );
                            if (allSelected) {
                                // Deselect all
                                toggleLevel("pending");
                                toggleLevel("verified");
                                toggleLevel("rejected");
                                toggleLevel("sum");
                            } else {
                                // Select all
                                if (!selectedLevels.includes("pending")) { toggleLevel("pending") };
                                if (!selectedLevels.includes("verified")) { toggleLevel("verified") };
                                if (!selectedLevels.includes("rejected")) { toggleLevel("rejected") };
                                if (!selectedLevels.includes("sum")) { toggleLevel("sum") };
                            }
                        }

                    }}
                >
                    {((displayMode === "difficulty" && selectedLevels.includes("easy") && selectedLevels.includes("medium") && selectedLevels.includes("hard")) || (displayMode === "acceptance" && selectedLevels.includes("pending") && selectedLevels.includes("verified")) && selectedLevels.includes("rejected")) && selectedLevels.includes("sum") ?
                        "Unselect All" : "Select All"}

                </button>
            </div>
            <div className="dividing-line"></div>

            {/* category selection */}
            <p><b>CATEGORIES:</b></p>
            <div className="filters-section">
                {groupedCategories.map(group => (
                    <div key={group.title} className="filters-group">
                        <span className="filters-group-title"><b>{"\u00A0".repeat(20 - group.title.length)}{group.title}</b></span>
                        {group.list.map(cat => {
                            // Find the matching category in the flat displayedCategories array
                            const displayedCat = displayedCategories.find(dc => dc.id === cat.id);
                            const isChecked = displayedCat?.display ?? true; // default to true if not found

                            return (
                                <label key={cat.id} className="filters-checkbox-label">
                                    <span>{cat.name}</span>
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
            {/* select / deselect all categories button */}
            <div className="filters-text-button-wrapper">
                <button
                    className="filters-text-button"
                    onClick={() => {
                        const allSelected = displayedCategories.every(cat => cat.display);  //check whether all fields are selected
                        setDisplayedCategories(prev => prev.map(dc => ({ ...dc, display: !allSelected })) //set the fields to an inverse of allSelected (works no matter the current state)
                        );
                    }}
                >
                    {displayedCategories.every(cat => cat.display)
                        ? "Unselect All"
                        : "Select All"}
                </button>
            </div>
            <div className="dividing-line"></div>

            {/* Dark mode + refresh section */}
            <p><b>MISC:</b></p>
            <div className="misc-controls">
                {/* Dark Mode Toggle */}
                <div>
                    <span>Dark Mode</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                {/* Refresh Data Button */}
                <div className="misc-item refresh-data">
                    <button
                        className="filters-text-button"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
