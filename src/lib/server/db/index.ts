import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function dbD1(platform: Readonly<App.Platform> | undefined) {
    if (!platform) {
        throw new Error('Platform not found')
    }
    return drizzle(platform.env.DB, { schema });
}