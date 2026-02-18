export interface Plan {
    id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: string;
}

export interface GenerateResponse {
    plan?: string;
    error?: string;
    requiresAuth?: boolean;
}
