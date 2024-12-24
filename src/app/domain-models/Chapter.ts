import { Block } from "./Block";

export interface Chapter {
    id?: string | null;
    title: string;
    blocks?: Block[];
    created_at?: Date | null;
}
