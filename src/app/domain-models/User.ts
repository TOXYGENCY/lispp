export interface User {
    id?: string | null;
    name: string;
    email: string;
    password?: string | null;
    userType: number;
    orgCode?: string | null;
    orgId?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

