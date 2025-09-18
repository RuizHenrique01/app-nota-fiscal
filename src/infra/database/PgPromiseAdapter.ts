import pgp from 'pg-promise';
import DatabaseConnection from './DatabaseConnection';

export default class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    constructor() {
        this.connection = pgp()('DB_CONNECTION_STRING');
    }

    async query(sql: string, params?: any[]): Promise<any> {
        return this.connection.query(sql, params);
    }

    async close(): Promise<void> {
        await this.connection.$pool.end();
    }
}


