"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autorManagement = autorManagement;
const inquirer_1 = __importDefault(require("inquirer"));
const menu_1 = require("../menu/menu");
const data_1 = __importDefault(require("../database/data"));
let author = [];
async function autorManagement() {
    while (true) {
        console.log("------- AUTHOR LIBRARY --------- ");
        let { bookList } = await inquirer_1.default.prompt([
            {
                type: "list",
                name: "bookList",
                message: "Select following option: ?",
                choices: [
                    { name: "add Author", value: 'add' },
                    { name: "update Author", value: 'update' },
                    { name: "delete Author", value: 'delete' },
                    { name: "show Author list", value: 'list_author' },
                    { name: "Exit", value: 'Exit' }
                ]
            }
        ]);
        switch (bookList) {
            case "add":
                await addAuthor();
                break;
            case "update":
                await updateAuthor();
                break;
            case "delete":
                await deleteAuthor();
                break;
            case "list_book":
                await listAuthor();
                break;
            case "Exit":
                await (0, menu_1.mainMenu)();
                break;
        }
    }
}
async function addAuthor() {
    console.log("------- ADD AUTHOR ---------");
    let { authorName, country } = await inquirer_1.default.prompt([
        {
            type: "input",
            name: "authorName",
            message: "add author name"
        },
        {
            type: "input",
            name: "country",
            message: "add author country"
        }
    ]);
    const insertInto = data_1.default.prepare("INSERT INTO author(name , country) VALUES (?, ?)");
    const result = insertInto.run(authorName, country);
    console.log('DATA ADDED SUCCESSFULLY!');
    console.table(result);
}
async function updateAuthor() {
    console.log("----- UPDATE AUTHOR -----");
    let authorId = data_1.default.prepare("SELECT * FROM author").all();
    let updateResult = authorId.map((author) => ({
        name: `${author.id} ${author.name}`,
        value: author.id
    }));
    let { update } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: "update",
            message: "Select id to update: ",
            choices: updateResult
        }
    ]);
    let { authorName } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: "authorName",
            message: "Enter new title:"
        }
    ]);
    let result = data_1.default.prepare("UPDATE author SET name = ? WHERE id = ?");
    result.run(authorName, update);
}
async function deleteAuthor() {
    console.log("----- DELETE AUTHOR ------");
    let selectAll = data_1.default.prepare("SELECT * FROM author").all();
    let deleteItem = selectAll.map((author) => ({
        name: `id: ${author.id} ${author.name}`,
        value: author.id
    }));
    let { deleteSelectItem } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: 'deleteSelectItem',
            message: "Select any one to delete: ",
            choices: deleteItem
        }
    ]);
    let { conform } = await inquirer_1.default.prompt([
        {
            type: "input",
            name: "conform",
            message: "Are you sure you want to delete (yes/no): ",
            choices: ['NO', 'YES']
        }
    ]);
    if (conform.toLowerCase() == "yes") {
        let result = data_1.default.prepare("DELETE FROM author WHERE id = ?");
        result.run(deleteSelectItem);
        console.log("Author deleted successfully! ");
    }
    else if (conform.toLowerCase() == "no") {
        return autorManagement();
    }
}
async function listAuthor() {
    console.log("----- AUTHOR LIST ------");
    let authors = data_1.default.prepare("SELECT * FROM author").all();
    let list = authors.map((auth) => ({
        id: auth.id,
        name: auth.name,
        country: auth.country
    }));
    console.log(list);
}
