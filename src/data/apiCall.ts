// IMPORTANT:
//
// info about API calls (according to opentdb docs): 
// 1. Max 50 questions per call
// 2. Only 1 category per call (or all categories at once)
// 3. You can call an API from a given IP only once every 5 seconds
// 4. Calling questions from single category so that they won't repeat requires using tokes, which need to be dynamically regenerated
// 5. Calling:
//  - https://opentdb.com/api_count_global.php
//  - https://opentdb.com/api_category.php
//  - https://opentdb.com/api_count.php?category=CAT_NUM
//    is not rate limited.
//
// SOLUTION:
// Skip generating tokens and asking for questions in bateches.
// Instead query the APIs that are not rate limited to download necessary statistical data.
// Single questions are of no use anyways in terms of general trend visualization. 
//
// NOTES:
// a. Type structure was checked by simply visiting the api webiste manually
// b. Searching through all categories for all correct answers still take some time.
//    A simple solution to this is starting by displaying data by completeness by default (fast)
//    and load it in the backround so that it displays instantly when the user changes the filter

import type { Category, CategoryName, CategoryAcceptanceCount } from "./categories";

// Counts cache (to not run calls all the time)
let globalCountsCache: Category[] = [];
let maxId: number = 0;

// Fetch all category names
async function fetchCategoryNames(): Promise<CategoryName[]> {

    //Get a response
    const res = await fetch("https://opentdb.com/api_category.php");
    if (!res.ok) throw new Error("Network response was not ok");

    // Parse data
    const data: {
        trivia_categories: {
            id: number;
            name: string;
        }[];
    } = await res.json();
    if (!data.trivia_categories || !Array.isArray(data.trivia_categories)) {
        throw new Error("Invalid categories data");
    }

    return data.trivia_categories;
}

// Fetch acceptance counts
async function fetchCategoryCounts(): Promise<CategoryAcceptanceCount[]> {

    // Get a response
    const res = await fetch("https://opentdb.com/api_count_global.php");
    if (!res.ok) throw new Error("Network response was not ok");

    // Parse data
    const data: {
        overall: {
            total_num_of_questions: number;
            total_num_of_pending_questions: number;
            total_num_of_verified_questions: number;
            total_num_of_rejected_questions: number;
        };
        categories: Record<
            string,
            {
                total_num_of_questions: number;
                total_num_of_pending_questions: number;
                total_num_of_verified_questions: number;
                total_num_of_rejected_questions: number;
            }
        >;
    } = await res.json();

    // Convert the objects to an array
    const categoryArray: CategoryAcceptanceCount[] = Object.entries(data.categories).map(
        ([id, c]) => ({
            id: Number(id),
            total_num_of_pending_questions: c.total_num_of_pending_questions,
            total_num_of_verified_questions: c.total_num_of_verified_questions,
            total_num_of_rejected_questions: c.total_num_of_rejected_questions,
        })
    );

    // Add the "All" global summary
    maxId = Math.max(...categoryArray.map(c => c.id)) + 1;
    categoryArray.push({
        id: maxId,
        total_num_of_pending_questions: data.overall.total_num_of_pending_questions,
        total_num_of_verified_questions: data.overall.total_num_of_verified_questions,
        total_num_of_rejected_questions: data.overall.total_num_of_rejected_questions,
    });

    return categoryArray;
}


// Returns all categories (together with their names and stats about questions)
export async function getCategorySummary(): Promise<Category[]> {

    let names: CategoryName[] = [];
    let acceptanceCount: CategoryAcceptanceCount[] = [];

    // Get data from API
    try {
        names = await fetchCategoryNames();
        acceptanceCount = await fetchCategoryCounts();
    } catch (e) {   // {TODO}
        console.error(e);
    }

    // Add the "All" category to names:
    names.push({ id: maxId, name: "All" });

    // Populating global counts
    globalCountsCache = names.map((nItem: CategoryName) => {
        const aItem = acceptanceCount.find((a) => nItem.id === a.id);
        return {
            id: nItem.id,
            name: nItem.name ?? "",
            total_num_of_pending_questions: aItem?.total_num_of_pending_questions ?? 0,
            total_num_of_rejected_questions: aItem?.total_num_of_rejected_questions ?? 0,
            total_num_of_verified_questions: aItem?.total_num_of_verified_questions ?? 0,
            total_easy_question_count: 0,
            total_medium_question_count: 0,
            total_hard_question_count: 0
        }
    })

    return globalCountsCache;
}

// Fetch adifficulty counts
export async function modifyDifficultyCounts(cat: Category): Promise<Partial<Category>> {

    const adr = `https://opentdb.com/api_count.php?category=${cat.id}`;
    try {

        let res: Response | null = null;
        let attempts = 0;


        while (attempts < 5) { // max 5 retries
            attempts++;
            try {

                res = await fetch(adr);
                if (res.status === 429) { // rate limit
                    console.warn(`Rate limit hit for category ${cat.id}, retrying...`);
                    await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
                    continue; // retry
                }

                if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);
                break; // success, exit retry loop

            } catch (err) {
                console.error(`Fetch error for category ${cat.id}:`, err);
                if (attempts >= 5) throw err; // give up after max attempts
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait before retry
            }
        }

        if (res) {
            const data = await res.json();

            return {
                total_easy_question_count: Number(data?.category_question_count?.total_easy_question_count ?? 0),
                total_medium_question_count: Number(data?.category_question_count?.total_medium_question_count ?? 0),
                total_hard_question_count: Number(data?.category_question_count?.total_hard_question_count ?? 0),
            };
        }

    } catch (err) {
        console.warn(`Failed to update category ${cat.id}:`, err);
    }

    return {
        total_easy_question_count: 0,
        total_medium_question_count: 0,
        total_hard_question_count: 0,
    };

}