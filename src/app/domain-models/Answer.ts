export interface Answer {
    id?: string | null;
    text: string;
    isCorrect: boolean;  // Правильность ответа
}