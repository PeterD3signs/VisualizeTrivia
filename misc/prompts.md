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
{title: string;
list: Category[]},
where “Category” is an Interface of the following structure:
interface Category extends CategoryAcceptanceCount {
name: string | null;
total_easy_question_count: number | null;
total_medium_question_count: number | null;
total_hard_question_count: number | null;},
and “CategoryAcceptanceCount” is an Interface that looks like this:
export interface CategoryAcceptanceCount {
id: number;
total_num_of_questions: number | null;
total_num_of_pending_questions: number | null;
total_num_of_verified_questions: number | null;
total_num_of_rejected_questions: number | null;}
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
