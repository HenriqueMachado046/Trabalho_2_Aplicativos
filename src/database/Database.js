import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

SQLite.enablePromise(true);

const getDBConnection = async () => {
    const db = await SQLite.openDatabase({ name: ':memory:'});
    return db;
};

const createTables = async (db) => {
    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        );
    `);
    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            content TEXT,
            FOREIGN KEY (userId) REFERENCES users(id)
        );
    `);
};

const syncData = async () => {
    try {
        const db = await getDBConnection();
        await createTables(db);

        const posts = await AsyncStorage.getItem('posts');
        if (posts) {
            const parsedPosts = JSON.parse(posts);
            parsedPosts.forEach(async (post) => {
                await db.executeSql(`INSERT INTO posts (userId, content) VALUES (?, ?)`, [post.userId, post.content]);
            });
        }

        const users = await AsyncStorage.getItem('users');
        if (users) {
            const parsedUsers = JSON.parse(users);
            parsedUsers.forEach(async (user) => {
                await db.executeSql(`INSERT INTO users (username, password) VALUES (?, ?)`, [user.username, user.password]);
            });
        }
    } catch (error) {
        console.error('Erro ao sincronizar os dados', error);
    }
};

export { getDBConnection, syncData };
