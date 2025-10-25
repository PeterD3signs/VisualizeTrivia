export interface CategoryAcceptanceCount {
    id: number;
    total_num_of_questions: number | null;
    total_num_of_pending_questions: number | null;
    total_num_of_verified_questions: number | null;
    total_num_of_rejected_questions: number | null;
}

export interface Category extends CategoryAcceptanceCount {
    name: string | null;
    total_easy_question_count: number | null;
    total_medium_question_count: number | null;
    total_hard_question_count: number | null;
}

export interface CategoryName {
    id: number;
    name: string | null;
}

export type GroupedCategory = {
    title: string;
    list: Category[];
};

//In case api calls completely dont work:
export const fallbackCategoris: { title: string; list: Category[] }[] = [
    {
        title: 'Science',
        list: [
            {
                id: 1,
                name: 'Physics',
                total_num_of_questions: 120,
                total_num_of_pending_questions: 20,
                total_num_of_verified_questions: 80,
                total_num_of_rejected_questions: 20,
                total_easy_question_count: 30,
                total_medium_question_count: 50,
                total_hard_question_count: 40,
            },
            {
                id: 2,
                name: 'Chemistry',
                total_num_of_questions: 100,
                total_num_of_pending_questions: 10,
                total_num_of_verified_questions: 70,
                total_num_of_rejected_questions: 20,
                total_easy_question_count: 25,
                total_medium_question_count: 40,
                total_hard_question_count: 35,
            },
        ],
    },
    {
        title: 'History',
        list: [
            {
                id: 3,
                name: 'Ancient',
                total_num_of_questions: 80,
                total_num_of_pending_questions: 10,
                total_num_of_verified_questions: 60,
                total_num_of_rejected_questions: 10,
                total_easy_question_count: 20,
                total_medium_question_count: 30,
                total_hard_question_count: 30,
            },
        ],
    },
];
