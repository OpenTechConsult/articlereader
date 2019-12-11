const sqlite3 = require('sqlite3');
const dbName = 'later.sqlite';
// connect to a database file
const db =  new sqlite3.Database(dbName);

db.serialize(() => {
    const sql = `CREATE TABLE IF NOT EXISTS articles(id INTEGER PRIMARY KEY, title VARCHAR(20), content TEXT)`;
    // creates an "articles" table if there isn't one
    db.run(sql);
});

class Article {

    // fetches all articles
    static all(cb) {
        db.all('SELECT * FROM articles', cb);
    }

    // selects a specific article
    static find(id, cb) {
        db.get('SELECT * FROM articles WHERE id = ?', id, cb);
    }

    static create(data, cb) {
        // specifies parameters with question marks
        const sql = 'INSERT INTO articles(title, content) VALUES(?, ?)';
        db.run(sql, data.title, data.content, cb);
    }

    static delete(id, cb) {
        if(!id) return cb(new Error('Please provide an id'));
        db.run('DELETE FROM articles WHERE id = ?', id, cb);
    }
}
module.exports = db;
module.exports.Article = Article;