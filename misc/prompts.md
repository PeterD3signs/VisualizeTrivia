# A selection of prompts I used for this project

## Note from author:
For this app I made sure to code all complex functionality (like the full API calls) and prepare data structures by myself.
This is a crucial part of the app and it is important to know and fully understand what is present in those areas of the code.

In this day and age it is very impractical to code everything by hand though!
This is why I decided to use AI for tedious parts (or to create skeletons for given functionality).
I decided to include some of the prompts here for the sake of transparency.

## Prompt 1 - Skeleton for components that use the already implemented API logic and data structures:

I am making a React Ts app that is going to be hosted on gitHub pages.
I need to present some cumulative data on a bar chart.
I have already implemented the necessary functionality, so let’s get straight to doing the components for the UI.
For drawing the charts I want to use the Recharts library (which I already installed with npm).

What is to be done:
1. Header (Include the site title and a small “about” button on the right side. We will go back to the about page later)
2. The main graph on the center of the page. It should update dynamically based on what data is shown and what filters are used by the user.
The horizontal axis should show the number of available questions, and the vertical axis should show categories.
Depending on whether a user selects to filter by difficulty or by question acceptance, I want to display 4 columns per category.
One column for easy questions / approved questions, one column for medium questions / unapproved questions,
one column for hard questions / pending questions. Lastly, one cumulative column.
3. The third thing is the filters. I want them to be directly to the left of the graph.
Firstly, I want a switch (toggle) to select between showing difficulty and approval of questions.
Next there should be four check boxes - one for easy/approved questions, one for medium... and so on…
To that add one check box for “all”. If the user deselects one, those columns won't appear on the chart (checkboxes should come pre clicked at start).
At last, there will be categories displayed inside those filters.
I just want a simple dynamic array of categories with check-boxes next to them.
The categories are sorted in a var called “groupCategories” of type:
```ts
{title: string;
list: Category[]}
```
where “Category” is an Interface of the following structure:
```ts
interface Category extends CategoryAcceptanceCount {
name: string | null;
total_easy_question_count: number | null;
total_medium_question_count: number | null;
total_hard_question_count: number | null;}
```
and “CategoryAcceptanceCount” is an Interface that looks like this:
```ts
export interface CategoryAcceptanceCount {
id: number;
total_num_of_questions: number | null;
total_num_of_pending_questions: number | null;
total_num_of_verified_questions: number | null;
total_num_of_rejected_questions: number | null;}
```
I want those categories in filters to be displayed one below another with the checkboxes on the right.
On the left, some curly brackets should encapsulate those categories based on the given group (marked with the title of this group).

The check boxes will of course disable which categories should be displayed.
4. The data for the graph should come from the same data structure mentioned in filters. 
The graph should be made of simple bars.
5. Below filters I also want a toggle for dark mode.
This is all in terms of the content, now in terms of style:
I want to use some pre-determined colours for primary and accent elements - think daisyUI for TailwindCSS
(To be clear, I don't use TailwindCSS in my project, this is just an example).
For the rest, just apply some styles and I will ask you to correct them if necessary.

## Prompt 2 - Skeleton for components that use the already implemented API logic and data structures:
Create me a graph with the use of the Recharts library (React, ts, hosted on GH Pages,NO Tailwind, so css in a separate file),
that will visualise data about trivia questions.
On the horizontal axis I want to see the the amount of questions in each category
and on the vertical axles I want to see the categories themselves.
The data is stored in a structure of type:
```ts
export type GroupedCategory = {
    title: string;
    list: Category[];
};
```
where Category is an Interface that looks like:
```ts
export interface Category extends CategoryAcceptanceCount { 
    name: string | null;
    total_easy_question_count: number | null;
    total_medium_question_count: number | null;
    total_hard_question_count: number | null;
};
```
and CategoryAcceptanceCount looks like this:
```ts
export interface CategoryAcceptanceCount {
    id: number;
    total_num_of_questions: number | null;
    total_num_of_pending_questions: number | null;
    total_num_of_verified_questions: number | null;
    total_num_of_rejected_questions: number | null;
}
```
User can see either the acceptance status of the question or the difficulty of a question based on:
```ts
const [displayMode, setDisplayMode] = useState<'difficulty' | 'acceptance'>('acceptance');
```
For both modes, user can select or deselect whether to show each difficulty/acceptance with:
```ts
const [selectedLevels, setSelectedLevels] = useState<string[]>(['pending', 'verified', 'rejected', 'sum']);
```
If 'selectedLevels' incudes a given level, you should show it. For difficulty the levels are just 'easy', 'medium', 'hard' and 'sum'.
Each category should have between 0 and 4 bars, depending on which of the following difficulty/acceptance is selected to be displayed.Last important detail is what categories should be shown.
This data structure contains the ids of all the categories that should be shown:
```ts
export type DisplayedCategory = { 
    id: number;
    display: boolean;
}

// SIDE NOTE: I later went on to change this to a Set<number> which remembers the IDs of categories that are to be shown.
```
 All logic is already implemented and works. I just need a reactive bar graph based on the provided data structures.
 Make the graph respond to the following colors:
```css
 :root { /* Light mode colors */
    --color-bg: #f9f9f9;
    --color-text: #111111;
    --color-primary: #621776;
    --color-accent: #9c34b9;
    --color-second-bg: #e5e7eb;
    --color-title: #e3aaff;
}
    
[data-theme="dark"] {
     --color-bg: #1f2937;
     --color-text: #eef7ff;
     --color-primary: #699cb9;
     --color-accent: #4e5d8f;
     --color-second-bg: #2a364c;
     --color-title: #eef7ff;
}
```
Data should be displayed per each category, and, on the left of the categories, there should be 
a curly bracket that visually encapsulates the categories into one group.
The group categories themselves do not need to be shown on the graph.
Also, all data structures and types together with the main app are already defined -
I only need a component which I can add to my main app.

## The rest:
Other prompts were rather minimal or did not include any specific data. I made sure to read and modify (if needed) every component that was produced by AI.
