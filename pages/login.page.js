"use strict";

const { By } = require('selenium-webdriver');
const BasePage = require('./basepage');

module.exports = class LoginPage extends BasePage {
    goToPage() {
        this.driver().get('http://test.qa.rs/login');
    }

    getInputUsername () {
        return this.driver().findElement(By.name('username'));
    }
    getInputPassword () {
        return this.driver().findElement(By.name('password'));
    }
    fillInputUsername (username) {
        this.getInputUsername().sendKeys(username);
    }
    fillInputPassword (password) {
        this.getInputPassword().sendKeys(password);
    }
    getLoginButton () {
        return this.driver().findElement(By.name('login'));
    }
    async clickLoginButton() {
        await this.getLoginButton().click();
    }
}