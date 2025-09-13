import pgp from 'pg-promise';
import DatabaseConnection from './DatabaseConnection';

export default class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    constructor() {
        this.connection = pgp()('postgres://postgres:root@localhost:5432/app');
    }

    async query(sql: string, params?: any[]): Promise<any> {
        return this.connection.query(sql, params);
    }

    async close(): Promise<void> {
        await this.connection.$pool.end();
    }
}


