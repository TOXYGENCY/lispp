export interface User {
    id?: string | null;
    name: string;
    email: string;
    password?: string | null;
    user_type: number;
    organization_code?: string | null;
    organization_id?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

