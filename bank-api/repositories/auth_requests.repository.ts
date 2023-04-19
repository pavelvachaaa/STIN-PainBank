import { Service, } from "typedi";
import IAuthRequest from "../models/IAuthRequest.js";
import IAuthRequestRepository from "../interfaces/AuthRequestRepository.interface.js";
import { DatabaseService } from "../services/database.service.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";

@Service()
export class AuthRequestRepository implements IAuthRequestRepository {
    constructor(private db: DatabaseService) {
    }

    public async remove(auth_request_id: string) {
        this.db.chain.get("auth_requests").remove({ auth_request_id: auth_request_id }).value()
        await this.db.write();
    }

    public async save(auth_request: IAuthRequest) {
        this.db.chain.get("auth_requests").value().push(auth_request);
        await this.db.write();
    }

    public async update(auth_request: IAuthRequest) {
        this.db.chain.get("auth_requests").find({ auth_request_id: auth_request.auth_request_id }).value().attempts_remaining = auth_request.attempts_remaining;
        await this.db.write();
    }

    public findById(id: string): IAuthRequest {
        const req = this.db.chain.get("auth_requests").find({ auth_request_id: id }).value()
        if (!req) {
            throw new AppError({
                description: "Požadavek nebyl nalezen",
                httpCode: HttpCode.NOT_FOUND,
                name: "AUTH_REQUEST_REPOSITORY"
            })
        }

        return req;
    }
}
export default AuthRequestRepository;