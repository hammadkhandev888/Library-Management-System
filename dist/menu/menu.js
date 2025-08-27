"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainMenu = mainMenu;
const inquirer_1 = __importDefault(require("inquirer"));
const serviceBook_1 = require("../services/serviceBook");
const serviceMember_1 = require("../services/serviceMember");
const borrowBook_1 = require("../services/borrowBook");
const autor_1 = require("../services/autor");
async function mainMenu() {
    while (true) {
        let { list } = await inquirer_1.default.prompt([
            {
                type: "list",
                name: 'list',
                message: "Select valide option: ",
                choices: [
                    { name: "Manage Authors", value: "author" },
                    { name: "Manage Books", value: "book" },
                    { name: "Manage Members", value: "member" },
                    { name: "Borrow & Return System", value: "borrow" },
                    { name: " Exit system", value: "Exit" },
                ]
            }
        ]);
        switch (list) {
            case "author":
                await (0, autor_1.autorManagement)();
                break;
            case "book":
                await (0, serviceBook_1.bookManagement)();
                break;
            case "member":
                await (0, serviceMember_1.memberManagement)();
                break;
            case "borrow":
                await (0, borrowBook_1.borrowManagement)();
                break;
            case "Exit":
                console.log("Good bye! ");
                process.exit();
        }
    }
}
