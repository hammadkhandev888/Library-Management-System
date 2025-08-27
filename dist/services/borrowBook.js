"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowManagement = borrowManagement;
const inquirer_1 = __importDefault(require("inquirer"));
const data_1 = __importDefault(require("../database/data"));
async function borrowManagement() {
    while (true) {
        console.log("---- BORROW SYSTEM -----");
        let { borrowAction } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: "borrowAction",
                message: "Select borrow option: ",
                choices: [
                    { name: "take a book to borrow ", value: "take" },
                    { name: "return a book to borrow ", value: "return" },
                    { name: "show all borrow book  ", value: "all" },
                    { name: "Exit  ", value: "exit" },
                ]
            }
        ]);
        switch (borrowAction) {
            case "take":
                await takeBook();
                break;
            case "return":
                await returnBook();
                break;
            case "all":
                await showAllBooks();
                break;
            case "exit":
                console.log("Good Bye! ");
                process.exit();
        }
    }
}
async function takeBook() {
    console.log("-------- BORROWED BOOK ---------");
    let allBooks = data_1.default.prepare("SELECT * FROM bookTable").all();
    let bookChoices = allBooks.map((book) => {
        let borrowed = data_1.default.prepare("SELECT 1 FROM borrowBook WHERE bookId = ? AND returnDate IS NULL").get(book.id);
        return {
            name: `${book.id} ${book.title}`,
            value: book.id,
            disabled: borrowed ? "Already borrowed" : false
        };
    });
    if (bookChoices.every((choice) => choice.disabled)) {
        console.log(" All books are already borrowed. Please return some first.");
        return;
    }
    let allMembers = data_1.default.prepare("SELECT * FROM member").all();
    let memberChoices = allMembers.map((m) => ({
        name: `${m.id} ${m.name}`,
        value: m.id
    }));
    let { booksId, membersId, borrowedDate } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "booksId",
            message: "Select book to borrow: ",
            choices: bookChoices
        },
        {
            type: "list",
            name: "membersId",
            message: "Select member: ",
            choices: memberChoices
        },
        {
            type: "input",
            name: "borrowedDate",
            message: "Enter borrowed date (YYYY-MM-DD): ",
            validate: (input) => {
                const regex = /^\d{4}-\d{2}-\d{2}$/;
                return regex.test(input.trim())
                    ? true
                    : "Please enter date in format YYYY-MM-DD";
            }
        }
    ]);
    data_1.default.prepare("INSERT INTO borrowBook (bookId, memberId, borrowDate) VALUES (?, ?, ?)").run(booksId, membersId, borrowedDate);
    console.log(" Book borrowed successfully!");
}
async function returnBook() {
    console.log("-------- RETURN BOOK ---------");
    let borrowedBooks = data_1.default.prepare(`
        SELECT * FROM borrowBook WHERE returnDate IS NULL
    `).all();
    if (borrowedBooks.length === 0) {
        console.log(" No borrowed books to return.");
        return;
    }
    let bookChoices = borrowedBooks.map((row) => {
        let book = data_1.default.prepare("SELECT title FROM bookTable WHERE id = ?").get(row.bookId);
        let member = data_1.default.prepare("SELECT name FROM member WHERE id = ?").get(row.memberId);
        return {
            name: `${row.id} | ${book.title} (borrowed by ${member.name} on ${row.borrowDate})`,
            value: row.id
        };
    });
    let { borrowId, returnDate } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "borrowId",
            message: "Select borrowed book to return:",
            choices: bookChoices
        },
        {
            type: "input",
            name: "returnDate",
            message: "Enter return date (YYYY-MM-DD): ",
            validate: (input) => {
                const regex = /^\d{4}-\d{2}-\d{2}$/;
                return regex.test(input.trim())
                    ? true
                    : "Please enter date in format YYYY-MM-DD";
            }
        }
    ]);
    data_1.default.prepare("UPDATE borrowBook SET returnDate = ? WHERE id = ?")
        .run(returnDate, borrowId);
    console.log(" Book returned successfully!");
}
async function showAllBooks() {
    console.log("----- BORROWED BOOK LIST ------");
    let listBooks = data_1.default.prepare("SELECT * FROM borrowBook").all();
    let list = listBooks.forEach((ite) => {
        console.log("-----------------------------");
        console.log(`id: ${ite.id} bookId: ${ite.bookId} , memberId: ${ite.memberId}  , borrowDate: ${ite.borrowDate} returnDate: ${ite.returnDate}`);
        console.log("-------------------------------");
    });
    console.log(list);
}
