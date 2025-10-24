export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export async function fetchQuestions(amount = 10): Promise<Question[]> {
    const res = await fetch(`https://opentdb.com/api.php?amount=${amount}`);
    const data = await res.json();
    return data.results;
}
