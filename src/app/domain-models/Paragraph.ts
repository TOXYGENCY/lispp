export interface Paragraph {
    id?: string | null;
    title: string;
    description_text: string;
    description_special?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}
