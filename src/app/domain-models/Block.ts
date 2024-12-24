import { Paragraph } from "./Paragraph";
import { Test } from "./Test";

export interface Block {
    id?: string | null;
    title: string;
    paragraphs?: Paragraph[];
    tests?: Test[];
    created_at?: Date | null;
}
