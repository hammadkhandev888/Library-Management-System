"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default("myDatabase.db");
db.exec(`
    CREATE TABLE IF NOT EXISTS bookTable(
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     authorId INTEGER NOT NULL,
     publishedYear TEXT NOT NULL,
     available TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS author (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     country TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS member (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     joinDate TEXT NOT NULL
    );
   CREATE TABLE IF NOT EXISTS borrowBook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL,
    memberId INTEGER NOT NULL,
    borrowDate TEXT NOT NULL,
    returnDate TEXT,
    FOREIGN KEY (bookId) REFERENCES bookTable(id),
    FOREIGN KEY (memberId) REFERENCES member(id)
);

`);
exports.default = db;
