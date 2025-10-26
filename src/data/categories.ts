//Interfaces:
export interface CategoryAcceptanceCount {
    id: number;
    total_num_of_pending_questions: number | null;
    total_num_of_verified_questions: number | null;
    total_num_of_rejected_questions: number | null;
}

export interface AcceptanceCount {
    total_easy_question_count: number | null;
    total_medium_question_count: number | null;
    total_hard_question_count: number | null;
}

export interface Category extends CategoryAcceptanceCount, AcceptanceCount {
    name: string | null;
}

export interface CategoryName {
    id: number;
    name: string | null;
}

export type GroupedCategory = {
    title: string;
    list: Category[];
};

