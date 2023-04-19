export default interface IAuthRequest {
    auth_request_id: string;
    email: string;
    code: number;
    expires_at: number;
    attempts_remaining: number;
}