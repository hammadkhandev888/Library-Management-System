"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookManagement = bookManagement;
const inquirer_1 = __importDefault(require("inquirer"));
const menu_1 = require("../menu/menu");
const data_1 = __importDefault(require("../database/data"));
let books = [];
async function bookManagement() {
    while (true) {
        console.log("------- BOOKS LIBRARY --------- ");
        let { bookList } = await inquirer_1.default.prompt([
            {
                type: "list",
                name: "bookList",
                message: "Select following option: ?",
                choices: [
                    { name: "add book", value: 'add' },
                    { name: "update book", value: 'update' },
                    { name: "delete book", value: 'delete' },
                    { name: "show book list", value: 'list book' },
                    { name: "Exit", value: 'Exit' }
                ]
            }
        ]);
        switch (bookList) {
            case "add":
                await addBook();
                break;
            case "update":
                await updateBook();
                break;
            case "delete":
                await deleteBook();
                break;
            case "list book":
                await listBook();
                break;
            case "Exit":
                await (0, menu_1.mainMenu)();
                break;
        }
    }
}
async function addBook() {
    console.log("------- ADD BOOKS --------");
    let authors = data_1.default.prepare("SELECT id, name FROM author").all();
    const authorChoices = authors.map((author) => ({
        name: `id: ${author.id} ${author.name}`,
        value: author.id
    }));
    if (authorChoices.length === 0) {
        console.log(" No authors found. Please add authors first.");
        return;
    }
    const { bookTitle, bookAuthorId, bookPublishedYear, bookAvailable } = await inquirer_1.default.prompt([
        {
            type: "input",
            name: "bookTitle",
            message: "Enter book title: ",
            validate: (input) => input.trim() ? true : "Please enter a correct book name."
        },
        {
            type: "list",
            name: "bookAuthorId",
            message: "Select author id: ",
            choices: authorChoices
        },
        {
            type: "input",
            name: "bookPublishedYear",
            message: "Enter book Published date (YYYY-MM-DD): ",
            validate: (input) => {
                const regex = /^\d{4}-\d{2}-\d{2}$/;
                return regex.test(input.trim()) ? true : "Please enter date in format YYYY-MM-DD";
            }
        },
        {
            type: "input",
            name: "bookAvailable",
            message: "Is book available? (yes/no): ",
            validate: (input) => input.trim() ? true : "Please enter status."
        }
    ]);
    const insertInto = data_1.default.prepare("INSERT INTO bookTable(title, authorId, publishedYear, available) VALUES (?, ?, ?, ?)");
    const result = insertInto.run(bookTitle, bookAuthorId, bookPublishedYear, bookAvailable);
    console.log('DATA ADDED SUCCESSFULLY!');
    console.table(result);
    console.log(books);
}
async function updateBook() {
    console.log("----- UPDATE BOOK -----");
    let bookId = data_1.default.prepare("SELECT * FROM bookTable").all();
    let updateResult = bookId.map((book) => ({
        name: `${book.id} ${book.title}`,
        value: book.id
    }));
    let { update } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: "update",
            message: "Select id to update: ",
            choices: updateResult
        }
    ]);
    let { newTitle } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: "newTitle",
            message: "Enter new title:"
        }
    ]);
    let result = data_1.default.prepare("UPDATE bookTable SET title = ? WHERE id = ?");
    result.run(newTitle, update);
}
async function deleteBook() {
    console.log("----- DELETE BOOK ------");
    let selectAll = data_1.default.prepare("SELECT * FROM bookTable").all();
    let deleteItem = selectAll.map((book) => ({
        name: `id: ${book.id} ${book.title}`,
        value: book.id
    }));
    let { deleteSelectItem } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: 'deleteSelectItem',
            message: "Select any one to delete: ",
            choices: deleteItem
        }
    ]);
    let result = data_1.default.prepare("DELETE FROM bookTable WHERE id = ?");
    result.run(deleteSelectItem);
}
async function listBook() {
    console.log("----- BOOK LIST ------");
    let listBooks = data_1.default.prepare("SELECT * FROM bookTable").all();
    let list = listBooks.forEach((ite) => {
        console.log("-----------------------------");
        console.log(` id: ${ite.id} , title: ${ite.title}  , authorId: ${ite.authorId}`);
        console.log("-------------------------------");
    });
    console.log(list);
}
