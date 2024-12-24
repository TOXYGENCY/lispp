import { Question } from "./Question";

export interface Test {
    id?: string | null;
    title: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    questions?: Question[];  // Вопросы внутри теста
}