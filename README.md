# Mini React Open Trivia DB visualization app

This app is based on React and uses Recharts for constructing graphs.
The main functionality is:
1. Calling the opentDB API to download data about all quesitions;
2. Managing how the data is kept (data structures) and displayed, so that core functionality is available quickly;
3. Showing dynamically constructed graphs based on the extensive filters available to the user.

App visualises data based on EVERY question available via the official Open Trivia DB API.

## What is happening under the hood
As much data as possible is gathered with just two first API calls (for question acceptance and for category titles).
The rest (which is acceptance data requiring separate API calls for each category) is fetched in the background with subsequent calls.

How?
By skipping the rate limitter for questions generated with a uniqe token (see opentDB docs) and instead using API calls without rate limits:
1. https://opentdb.com/api_count_global.php - returns the number of all questions in the database (pending, verified and rejected);
2. https://opentdb.com/api_category.php - returns the entire list of categories and their ids;
3. https://opentdb.com/api_count.php?category=X - returns the nuber of questions (easy, medium, hard) in a category with id=X.

Additional features:
- fully custom UI (each element, excluding the graphs, was custom coded)
- mobile version (custom layout for narrow screens)
- selection between a bar chart and a pie chart for data visualization

## Notes
This project was done as part of a recruitment process for an Internship position at JetBrains.
Because of that, the logo is ispired by the amazing graphics used by JetBrains.
Coding the app was great fun, especially with the added challange of a limited time!