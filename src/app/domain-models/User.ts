export interface User {
    id?: string | null;
    name: string;
    email: string;
    password?: string | null;
    user_type: number;
    organization_code?: string | null;
    organization_id?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

