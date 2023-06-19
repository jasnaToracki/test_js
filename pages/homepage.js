"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require('./basepage');

module.exports = class Homepage extends BasePage {
    goToPage () {
        this.driver().get('http://test.qa.rs/');
    }

    async clickOnRegisterLink() {
        const registerLink = await this.driver().findElement(By.linkText('Register'));
        await registerLink.click();
    }

    getSuccessAlertText () {
        return this.driver().findElement(By.className('alert alert-success')).getText();
    }

    getWelcomeBackTitle() {
        return this.driver().findElement(By.css('h2')).getText();
    }

    getLinkLogin () {
        return this.driver().findElement(By.linkText('Login'));
    }
    isLoginLinkDisplayed() {
        return this.getLinkLogin().isDisplayed();
    }

    clickLogoutLink () {
        this.driver().get('http://test.qa.rs/logout')
    }

    getPackageDiv (title) {
        const xpathPackage = `//h3[contains(text(), "${title}")]/ancestor::div[contains(@class, "panel")]`;
        return this.driver().findElement(By.xpath(xpathPackage));
    }

    getInputQuantity (packageDiv) {
        return packageDiv.findElement(By.name('quantity'));
    }

    getSideDishDropdown (packageDiv) {
        return packageDiv.findElement(By.name('side'));
    }

    getSideDishOptions (sideDishDropdown) {
        return sideDishDropdown.findElements(By.tagName('option'));
    }

    getInputCutlery (packageDiv) {
        return packageDiv.findElement(By.name('cutlery'));
    }

    getOrderButton (packageDiv) {
        return packageDiv.findElement(By.className('btn btn-success'));
    }
}