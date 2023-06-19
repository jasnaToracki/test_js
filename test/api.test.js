"use strict";

const chai = require ('chai');
const chaiHttp = require ('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
require('dotenv').config();

describe ('api.test.qa.rs', () => {
    let request;

    before(() => {
        request = chai.request(process.env.API_BASE_URL);
    });
});