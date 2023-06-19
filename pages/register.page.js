"use strict";

const { By } = require('selenium-webdriver');
const BasePage = require('./basepage');

module.exports = class RegisterPage extends BasePage {

    goToPage() {
        this.driver().get('http://test.qa.rs/register');
    }

    getInputFirstName () {
        return this.driver().findElement(By.name('firstname'));
    }
    getInputLastName () {
        return this.driver().findElement(By.name('lastname'));
    }
    getInputEmail () {
        return this.driver().findElement(By.name('email'));
    }
    getInputUsername () {
        return this.driver().findElement(By.name('username'));
    }
    getInputPassword () {
        return this.driver().findElement(By.name('password'));
    }
    getInputPasswordConfirm () {
        return this.driver().findElement(By.name('passwordAgain'));
    }

    fillInputFirstName (firstname) {
        this.getInputFirstName().sendKeys(firstname);
    }
    fillInputLastName (lastname) {
        this.getInputLastName().sendKeys(lastname);
    }
    fillInputEmail (email) {
        this.getInputEmail().sendKeys(email);
    }
    fillInputUsername (username) {
        this.getInputUsername().sendKeys(username);
    }
    fillInputPassword (password) {
        this.getInputPassword().sendKeys(password);
    }
    fillInputPasswordConfirm (passwordAgain) {
        this.getInputPasswordConfirm().sendKeys(passwordAgain);
    }
    getRegisterButton () {
        return this.driver().findElement(By.name('register'));
    }

}