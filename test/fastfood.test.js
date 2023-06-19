"use strict";

require ('chromedriver');
const webdriver = require ('selenium-webdriver');
const {By, Key, until} = require ('selenium-webdriver');
const chai = require ('chai');
const chaiAsPromised = require ('chai-as-promised');
chai.use (chaiAsPromised);
chai.should();
const {assert, expect} = require ('chai');
require('dotenv').config();

const Homepage = require('../pages/homepage');
const RegisterPage = require ('../pages/register.page');
const LoginPage = require ('../pages/login.page');
const CartPage = require ('../pages/cart.page');
const CheckoutPage = require ('../pages/checkout.page');

const testData = require ('../data/fastfood.json');

describe.only ('FastFood.test.js', function () {
    let driver;
    let pageHomepage;
    let pageRegister;
    let pageLogin;
    let pageCart;
    let pageCheckout;

    let cartTotalAmount;

    let packages;


    before(function () {
        driver = new webdriver.Builder().forBrowser(process.env.USE_BROWSER).build();
        pageHomepage = new Homepage(driver);
        pageRegister = new RegisterPage(driver);
        pageLogin = new LoginPage(driver);
        pageCart = new CartPage(driver);
        pageCheckout = new CheckoutPage(driver);

        packages = testData.order;
    });

    after(async function() {
        await driver.quit();
    });

    it ('Verifies homepage is open and performs a click on register link', async function () {
        await pageHomepage.goToPage();

        const pageTitle = await pageHomepage.getPageHeaderTitle();
        expect (pageTitle).to.contain('QA FastFood');

        await pageHomepage.clickOnRegisterLink();
        expect (await pageRegister.getCurrentUrl()).to.be.eq('http://test.qa.rs/register');
    });

    it ('Successfully performs registration', async function () {

        await pageRegister.fillInputFirstName(process.env.LOGIN_USERNAME);
        await pageRegister.fillInputLastName(process.env.LOGIN_PASSWORD);

        const randomNumber = pageRegister.random(15000, 1500000000);
        await pageRegister.fillInputEmail(process.env.LOGIN_EMAIL + randomNumber);
        await pageRegister.fillInputUsername(process.env.LOGIN_USERNAME + "." + randomNumber);
        await pageRegister.fillInputPassword(process.env.LOGIN_PASSWORD);
        await pageRegister.fillInputPasswordConfirm(process.env.LOGIN_PASSWORD);

        await pageRegister.getRegisterButton().click();

        expect (await pageHomepage.getSuccessAlertText()).to.contain('Success!');
    });

    it ('Successfully login user', async function() {
        await pageLogin.goToPage();

        await pageLogin.fillInputUsername(process.env.LOGIN_USERNAME);
        await pageLogin.fillInputPassword(process.env.LOGIN_PASSWORD);
        await pageLogin.clickLoginButton();

        expect (await pageHomepage.getWelcomeBackTitle()).to.contain('Welcome back');
    });


    it ('Adds items to cart', async function () {
        for (const index in packages) {
            const item = packages[index];

            const packageDiv = await pageHomepage.getPackageDiv(item.package);

            await pageHomepage.getInputQuantity(packageDiv).clear();
            await pageHomepage.getInputQuantity(packageDiv).sendKeys(item.quantity);

            if (item.cutlery === true) {
                await pageHomepage.getInputCutlery(packageDiv).click();
            }

            const sideDishDropdownOption = await pageHomepage.getSideDishDropdown(packageDiv);
            const options = await pageHomepage.getSideDishOptions(sideDishDropdownOption);

            await Promise.all(options.map(async function(option) {
                const text = await option.getText();

                if (text === item.sideDish) {
                    await option.click();

                    await pageHomepage.getOrderButton(packageDiv).click();
                    expect(await driver.getCurrentUrl()).to.contain('http://test.qa.rs/order');
                }}
            ));
            pageHomepage.goToPage();
        }
    });

    it ('Opens shopping cart', async function () {
        await pageHomepage.clickOnViewShoppingCartLink();

        expect (await pageCart.getCurrentUrl()).to.be.eq('http://test.qa.rs/cart');
        expect (await pageCart.getPageHeaderTitle()).to.contain('Order');
    });

    it ('Verifies items are in cart', async function () {
        for (const index in packages) {
            const item = packages[index];

            const orderRow = await pageCart.getOrderRow(item.package.toUpperCase());
            const itemQuantity = await pageCart.getItemQuantity(orderRow);

            expect (await itemQuantity.getText()).to.eq(item.quantity.toString());
        }
    });

    it ('Verifies total item price is correct', async function () {
        for (const index in packages) {
            const item = packages[index];

            const orderRow = await pageCart.getOrderRow(item.package.toUpperCase());
            const itemQuantity = await pageCart.getItemQuantity(orderRow);
            const itemPrice = await pageCart.getItemPrice(orderRow);

            const quantity = Number(await itemQuantity.getText());
            const price = ((await itemPrice.getText()).replaceAll('$', ''));

            let priceWithout$ = (price.toString());
            let finalPrice = eval(priceWithout$);

            const totalItemPrice = Number (finalPrice * quantity);
        }
        cartTotalAmount = Number ((await pageCart.getCartTotal().getText()).replace('Total: $', ''));
    });

    it ('Performs checkout', async function() {
        await pageCart.clickOnCheckoutButton();

        expect (await pageCheckout.getPageTitle()).to.contain('You have successfully placed your order.');
    });

    it ('Verifies checkout total amount', async function() {
        const informationRow = await pageCheckout.getPriceInformation();
        const checkoutPrice = Number ((await informationRow.getText()).replace('Your credit card has been charged with the amount of $', ''));

        expect(checkoutPrice).to.be.eq(cartTotalAmount);
    });

    it ('Successfully perform user logout', async function () {
        await pageHomepage.clickLogoutLink();

        expect (await pageHomepage.isLoginLinkDisplayed()).to.be.true;
    });
});