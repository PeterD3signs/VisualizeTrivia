// IMPORTANT:
//
// info about API calls (according to opentdb docs): 
// 1. Max 50 questions per call
// 2. Only 1 category per call (or all categories at once)
// 3. You can call an API from a given IP only once every 5 seconds
// 4. Calling:
//  - https://opentdb.com/api_count_global.php
//  - https://opentdb.com/api_category.php
//    is not rate limited.
//
// Type structure was checked by simply visiting the api webiste manually 

//Interfaces
export interface Category {
    id: number;
    name: string | null;
    total_num_of_questions: number | null;
    total_num_of_pending_questions: number | null;
    total_num_of_verified_questions: number | null;
    total_num_of_rejected_questions: number | null;

}

export interface CategoryName {
    id: number;
    name: string | null;
}

export interface CategoryQuestionCount {
    id: number;
    total_num_of_questions: number | null;
    total_num_of_pending_questions: number | null;
    total_num_of_verified_questions: number | null;
    total_num_of_rejected_questions: number | null;

}

export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

// Counts cache (to not run calls all the time)
let globalCountsCache: Category[] | null = null;
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

// Fetch all category counts
async function fetchCategoryCounts(): Promise<CategoryQuestionCount[]> {

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
    const categoryArray: CategoryQuestionCount[] = Object.entries(data.categories).map(
        ([id, c]) => ({
            id: Number(id),
            total_num_of_questions: c.total_num_of_questions,
            total_num_of_pending_questions: c.total_num_of_pending_questions,
            total_num_of_verified_questions: c.total_num_of_verified_questions,
            total_num_of_rejected_questions: c.total_num_of_rejected_questions,
        })
    );

    // Add the "All" global summary
    maxId = Math.max(...categoryArray.map(c => c.id)) + 1;
    categoryArray.push({
        id: maxId,
        total_num_of_questions: data.overall.total_num_of_questions,
        total_num_of_pending_questions: data.overall.total_num_of_pending_questions,
        total_num_of_verified_questions: data.overall.total_num_of_verified_questions,
        total_num_of_rejected_questions: data.overall.total_num_of_rejected_questions,
    });

    return categoryArray;
}

// Returns all categories (together with their names and stats about questions)
export async function getCategorySummary(): Promise<Category[]> {

    let names: CategoryName[] = [];
    let counts: CategoryQuestionCount[] = [];

    // Get data from API
    try {
        names = await fetchCategoryNames();
        counts = await fetchCategoryCounts();
    } catch (e) {
        console.error(e);
    }

    // Add the "All" category to names:

    names.push({id: maxId, name: "All"});

    // Populating global counts
    globalCountsCache = names.map((namesItem: CategoryName) => {
        const countsItem = counts.find((x) => namesItem.id === x.id);
        return {
            id: namesItem.id,
            name: namesItem.name ?? "",
            total_num_of_questions: countsItem?.total_num_of_questions ?? 0,
            total_num_of_pending_questions: countsItem?.total_num_of_pending_questions ?? 0,
            total_num_of_rejected_questions: countsItem?.total_num_of_rejected_questions ?? 0,
            total_num_of_verified_questions: countsItem?.total_num_of_rejected_questions ?? 0
        }
    })

    return globalCountsCache;
}


export async function fetchQuestions(amount = 10): Promise<Question[]> {
    const res = await fetch(`https://opentdb.com/api.php?amount=${amount}`);
    const data = await res.json();
    return data.results;
}
