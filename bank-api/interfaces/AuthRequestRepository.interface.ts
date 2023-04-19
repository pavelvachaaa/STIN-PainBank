import IAuthRequest from "../models/IAuthRequest.js";

export default interface IAuthRequestRepository {
    save(auth_request: IAuthRequest): any;
    findById(auth_request_id: string): any;
    remove(auth_request_id: string): any;
    update(auth_request: IAuthRequest): any;
}