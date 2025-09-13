export default interface DatabaseConnection {
    query(sql: string, params?: any[]): Promise<any>;
    close(): Promise<void>;
}