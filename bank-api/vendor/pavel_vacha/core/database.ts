import { Low, Memory } from "lowdb";
import DatabaseScheme from "../../../types/database_sceheme.type.js";
import { JSONFile } from "lowdb/node";
import lodash from 'lodash'

/**
 * @author Pavel Vácha
 * @version 1.0
 * Databázový wrapper okolo LowDB, jediný svého druhu
*/

class LowWithLodash<T> extends Low<T> {
    chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

// TODO: Zamyslet se nad tím jestli nedochází k nějakým lockům 
class Database {
    private _db: LowWithLodash<DatabaseScheme>;


    constructor(filePath: string, test: boolean = false) {
        let adapter: any;
        adapter = test ? new Memory<DatabaseScheme>() : new JSONFile<DatabaseScheme>(filePath)
        this._db = new LowWithLodash(adapter);
    }

    public async createConnection() {
        await this._db.read()
        this._db.data = this._db.data || { users: [], payments: [], auth_requests: [], currencies: [] }
        await this._db.write()
    }

    public find<T>(path: keyof DatabaseScheme, obj: Partial<T>): T[] {
        return (this.db.chain.get<keyof DatabaseScheme>(path, []) as any).filter(obj).value() ?? []
    }

    public findOne<T>(path: keyof DatabaseScheme, obj: Partial<T>): T {
        return (this.db.chain.get<keyof DatabaseScheme>(path) as any).find(obj).value()
    }

    public async push<T>(path: keyof DatabaseScheme, obj: Partial<T>[]) {
        await (this._db.chain.get(path).value() as any).push(...obj);
    }

    public async write() {
        await this.db.write();
    }

    public async read() {
        await this.db.read();
    }

    public async set(path: keyof DatabaseScheme, data: any) {
        await this.push(path, data);
    }

    public get chain(): lodash.ObjectChain<DatabaseScheme> {
        return this._db.chain;
    }

    public set chain(chain: any) {
        this._db.chain = chain;
    }

    public get db(): LowWithLodash<DatabaseScheme> {
        return this._db;
    }

}

export default Database;