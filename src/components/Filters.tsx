import React from 'react';
import './componentStyles/Filters.css';
import type { GroupedCategory } from '../data/categories';

interface Props {
    selectedLevels: string[];   //difficulty levels / acceptance levels - 'easy', 'medium', 'hard', 'sum' / 'pending', 'verified', 'rejected', 'sum'.
    displayMode: 'difficulty' | 'acceptance';
    groupedCategories: GroupedCategory[];
    displayedCategories: Set<number>;
    darkMode: boolean;
    barHeight: number;
    pieChart: boolean;
    mobileMode: boolean;
    filtersExtended: boolean;
    setDisplayMode: (mode: 'difficulty' | 'acceptance') => void;
    setSelectedLevels: React.Dispatch<React.SetStateAction<string[]>>;
    setDisplayedCategories: React.Dispatch<React.SetStateAction<Set<number>>>;
    setDarkMode: (value: boolean) => void;
    setBarHeight: (value: number) => void;
    setPieChart: (value: boolean) => void;
}

const Filters: React.FC<Props> = ({
    displayMode,
    setDisplayMode,
    selectedLevels,
    setSelectedLevels,
    groupedCategories,
    setDisplayedCategories,
    displayedCategories,
    darkMode,
    barHeight,
    setDarkMode,
    setBarHeight,
    pieChart,
    setPieChart,
    mobileMode,
    filtersExtended
}) => {
    const toggleLevel = (level: string) => {    //add or delete a given difficulty level.
        setSelectedLevels(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    if (filtersExtended || !mobileMode){
    return (
         <div className={`filters-wrapper ${mobileMode ? "filters-bottom-border" : ""}`}>
            <div className={`filters ${mobileMode ? "filters-right-border filters-left" : ""}`} style={{ width: mobileMode ? "100%" : "20rem" }}>
                {/* visualize question difficulty or question acceptance status */}
                <div className={`dividing-line ${mobileMode ? "line-div-mobile" : ""}`}></div>
                <p><b>PLOT QUESTIONS BY:</b></p>

                <div className="data-type-toggle">
                    <p className={`${displayMode === "acceptance" ? "toggle-p" : ""} ${mobileMode ? "reduce-p-size" : ""}`} >Acceptance</p>
                    <button className={`toggle-button ${mobileMode ? "toggle-button-mobile" : ""}`} onClick={() => setDisplayMode(displayMode === "difficulty" ? "acceptance" : "difficulty")}>
                        <div className={`toggle-circle ${displayMode === "difficulty" ? "selected" : ""}`}></div>
                    </button>
                    <p className={`${displayMode === "difficulty" ? "toggle-p" : ""} ${mobileMode ? "reduce-p-size" : ""}`}>Difficulty</p>
                </div>
                <div className={`dividing-line additional-top-margin ${mobileMode ? "line-div-mobile" : ""}`}></div>

                {/* graph type */}
                <p><b>GRAPH TYPE:</b></p>
                <div className="data-type-toggle">
                    <p className={`${pieChart ? "toggle-p" : ""} ${mobileMode ? "reduce-p-size" : ""}`} >Cumulative</p>
                    <button className={`toggle-button ${mobileMode ? "toggle-button-mobile" : ""}`} onClick={() => setPieChart(!pieChart)}>
                        <div className={`toggle-circle ${!pieChart ? "selected" : ""}`}></div>
                    </button>
                    <p className={`${!pieChart ? "toggle-p" : ""} ${mobileMode ? "reduce-p-size" : ""}`}>{mobileMode ? "Category" : "By category"}</p>
                </div>
                <div className={`dividing-line additional-top-margin ${mobileMode ? "line-div-mobile" : ""}`}></div>

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
                            ? (pieChart ? ["easy", "medium", "hard"] : ["easy", "medium", "hard", "sum"])
                            : (pieChart ? ["pending", "verified", "rejected"] : ["pending", "verified", "rejected", "sum"])
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
                            "Deselect All" : "Select All"}

                    </button>
                </div>
                <div className={`dividing-line ${mobileMode ? "line-div-mobile" : ""}`}></div>
                {/* category selection */}
                {!mobileMode && <p><b>CATEGORIES:</b></p>}
                {!mobileMode &&
                    <div className="filters-section">
                        {groupedCategories.map(group => (
                            <div key={group.title} className="filters-group">
                                <span className="filters-group-title"><b>{"\u00A0".repeat(20 - group.title.length)}{group.title}</b></span>
                                {group.list.map(cat => {
                                    const isChecked = displayedCategories.has(cat.id); // default to true if not found

                                    return (
                                        <label key={cat.id} className="filters-checkbox-label">
                                            <span>{cat.name}</span>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    setDisplayedCategories(prev => {
                                                        const newSet = new Set(prev);
                                                        if (newSet.has(cat.id)) newSet.delete(cat.id);
                                                        else newSet.add(cat.id);
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                }
                {/* select / deselect all categories button */}
                {!mobileMode &&
                    <div className="filters-text-button-wrapper">
                        <button
                            className="filters-text-button"
                            onClick={() => {
                                const allSelected = groupedCategories.flatMap(g => g.list).every(cat => displayedCategories.has(cat.id));  //check whether all fields are selected
                                setDisplayedCategories(() => {
                                    if (allSelected) {
                                        return new Set();
                                    } else {
                                        return new Set(
                                            groupedCategories.flatMap(g => g.list.map(c => c.id))
                                        );
                                    }

                                });
                            }}
                        >
                            {groupedCategories
                                .flatMap(g => g.list)
                                .every(cat => displayedCategories.has(cat.id))
                                ? "Deselect All"
                                : "Select All"}
                        </button>
                    </div>
                }
                {!mobileMode && <div className="dividing-line"></div>}

                {/* Misc */}
                <p><b>MISC:</b></p>
                <div className="misc-controls">
                    {/* BarHeightSlider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <label htmlFor="barHeightSlider">Bar Height</label>
                        <input
                            id="barHeightSlider"
                            type="range"
                            min={2}
                            max={50}
                            value={barHeight}
                            onChange={(e) => setBarHeight(Number(e.target.value))}
                        />
                    </div>

                    {/* Dark Mode Toggle */}

                    <div className="data-type-toggle-dark-mode">
                        <span>Dark Mode</span>
                        <div className="data-type-toggle">
                            <button className="toggle-button" onClick={() => setDarkMode(!darkMode)}>
                                <div className={`toggle-circle ${darkMode ? "selected" : ""}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`dividing-line ${mobileMode ? "line-div-mobile" : ""}`}></div>

                {/* Refresh Data Button */}
                <div className="refresh-data">
                    <button
                        className={`filters-text-button ${mobileMode ? "line-div-mobile" : ""}`}
                        onClick={() => window.location.reload()}
                    >
                        Refresh Data
                    </button>
                </div>
            </div>
            {mobileMode &&
                <div className="filters filters-right">
                    <p><b>CATEGORIES:</b></p>
                    <div className="filters-section">
                        {groupedCategories.map(group => (
                            <div key={group.title} className="filters-group">
                                <span className="filters-group-title"><b>{"\u00A0".repeat(20 - group.title.length)}{group.title}</b></span>
                                {group.list.map(cat => {
                                    const isChecked = displayedCategories.has(cat.id); // default to true if not found

                                    return (
                                        <label key={cat.id} className="filters-checkbox-label">
                                            <span>{cat.name}</span>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    setDisplayedCategories(prev => {
                                                        const newSet = new Set(prev);
                                                        if (newSet.has(cat.id)) newSet.delete(cat.id);
                                                        else newSet.add(cat.id);
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    <div className="filters-text-button-wrapper">
                        <button
                            className="filters-text-button"
                            onClick={() => {
                                const allSelected = groupedCategories.flatMap(g => g.list).every(cat => displayedCategories.has(cat.id));  //check whether all fields are selected
                                setDisplayedCategories(() => {
                                    if (allSelected) {
                                        return new Set();
                                    } else {
                                        return new Set(
                                            groupedCategories.flatMap(g => g.list.map(c => c.id))
                                        );
                                    }

                                });
                            }}
                        >
                            {groupedCategories
                                .flatMap(g => g.list)
                                .every(cat => displayedCategories.has(cat.id))
                                ? "Deselect All"
                                : "Select All"}
                        </button>
                    </div>
                </div>
            }
        </div>
    );
} else {
    return (<></>);
}

};

export default Filters;
