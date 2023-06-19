"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require('./basepage');

module.exports = class CheckoutPage extends BasePage {
    getPriceInformation() {
        return this.driver().findElement(By.tagName('h3'));
    }
}