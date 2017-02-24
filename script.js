/**
 * Created by Illya on 22.02.2017.
 */
const operations = {
    'add': "+",
    'eq': "=",
    'mult': '*',
    'div': '/',
    'sub': '-'
};

class Model {
    constructor() {
        this.operation = "";
        this.operand1 = "";
        this.operand2 = "";
        this.result = 0;
        this.isResult = false;
        this.resultString = "";
    }

    setChar(char) {
        console.log("isRes" + this.isResult);
        if (this.isResult) {
            this.reset();
        }
        if (this.operation === "") {
            this.operand1 += char;
        } else {
            this.operand2 += char;
        }
        this.resultString += char;
        console.log(`operand1 = ${this.operand1}`);
        console.log(`operand2 = ${this.operand2}`);
        console.log(` ${this.operation}`);
    }

    getResultString() {
        return this.resultString;
    }

    setOperation(operation) {
        if (this.operand1 === "" && this.operand2 === "") {
            this.operand1 = 0;
            this.operation = operation;
            this.resultString = "0" + operations[this.operation];
            console.log("lmao:1");
        } else if (this.isResult) {
            this.operation = operation;
            this.operand1 = this.result;
            this.operand2 = "";
            this.isResult = false;
            this.resultString += operations[this.operation];
        } else if (this.operation === "") {
            this.operation = operation;
            this.resultString += operations[this.operation];
        } else if (this.operand1 !== "" && this.operand2 === "") {
            this.operation = operation;
            let tempString = this.resultString;
            this.resultString = tempString.substring(0, tempString.length - 1) + operations[this.operation];
        } else if (this.operand1 !== "" && this.operand2 !== "") {
            this.performExpression();
            if (this.resultString === "Division by 0") {
                this.reset();
                this.resultString = "Division by 0";
            } else {
                this.operand1 = this.result;
                this.operand2 = "";
                this.operation = operation;
                this.isResult = false;
                this.resultString += operations[this.operation];
            }
        }
    }

    getResult() {
        this.isResult = true;
        if (this.operand2 === "") {
            this.result = this.operand1;
        }
        return this.result;
    }

    setResult(value) {
        this.result = value;
        this.reset();
    }

    reset() {
        this.operation = "";
        this.operand1 = "";
        this.operand2 = "";
        this.result = 0;
        this.isResult = false;
        this.resultString = "";
    }

    performExpression() {
        if (this.operand2 === "") {
            this.result = this.operand1;
        } else {
            switch (this.operation) {
                case 'add':
                    this.result = parseFloat(this.operand1) + parseFloat(this.operand2);
                    break;
                case 'mult':
                    this.result = parseFloat(this.operand1) * parseFloat(this.operand2);
                    break;
                case 'sub':
                    this.result = parseFloat(this.operand1) - parseFloat(this.operand2);
                    break;
                case 'div':
                    if (this.operand2 === '0') {
                        this.resultString = "Division by 0";
                        this.operand1 = "";
                        this.operand2 = "";
                        this.result = 0;
                    } else {
                        this.result = parseFloat(this.operand1) / parseFloat(this.operand2);
                    }
                    break;
                default:
                    this.result = this.operand1;
            }
        }
        this.isResult = true;
        this.resultString !== "Division by 0" ? this.resultString = this.result : this.resultString;
    }
}


class View {

    constructor() {
        this.screen = document.getElementById('display');
        this.screen.value = "0";
        this.operations = document.querySelectorAll('.operation');
        this.clearBtn = document.getElementById('CE');
        this.keys = document.querySelectorAll('.key');
        this.equal = document.getElementById('eq');
    }

    displayResult(value) {
        this.screen.value = value;
    }

    clearScreen() {
        this.screen.value = "0";
    }

    getDisplayResult() {
        return this.screen.value;
    }
}

class Controller {

    constructor(Model, View) {
        this.model = new Model();
        this.view = new View();
    }

    keysListener() {
        console.log(this.view.keys);
        this.view.keys.forEach((e) => e.addEventListener('click', () => {
            this.model.setChar(e.getAttribute('data-key'));
            this.view.displayResult(this.model.getResultString());
        }));
    }

    operationsListener() {
        this.view.operations.forEach((e) => e.addEventListener('click', () => {
            let displayString = this.view.getDisplayResult();
            this.model.setOperation(e.getAttribute('data-op'));
            this.view.displayResult(this.model.getResultString());
        }));
    }

    equationListener() {
        this.view.equal.addEventListener('click', () => {
            this.model.performExpression();
            this.view.displayResult(this.model.getResultString());
        });
    }

    clearListener() {
        this.view.clearBtn.addEventListener('click', () => {
            this.model.reset();
            this.view.clearScreen();
        })
    }
}

class Calculator {
    constructor(Controller, Model, View) {
        this.controller = new Controller(Model, View);
    }

    init() {
        this.controller.keysListener();
        this.controller.clearListener();
        this.controller.equationListener();
        this.controller.operationsListener();
    }
}

const calculator = new Calculator(Controller, Model, View);
calculator.init();

