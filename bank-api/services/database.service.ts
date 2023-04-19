import { Service, Inject, Container } from "typedi";
import Database from "../vendor/pavel_vacha/core/database.js";

/// Singleton servisa pro databázi
@Service()
export class DatabaseService extends Database {
    constructor() {
        super("./data/db.json", false);
        this.createConnection();
    }

    async createConnection() {
        await super.createConnection();
    }
}