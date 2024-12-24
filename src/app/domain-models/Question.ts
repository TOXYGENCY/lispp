import { Answer } from "./Answer";

export interface Question {
    id?: string | null;
    text: string;
    answers: Answer[];  // Ответы к вопросу
}