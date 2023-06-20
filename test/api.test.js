"use strict";

const chai = require ('chai');
const chaiHttp = require ('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
require('dotenv').config();

describe.only ('api.test.qa.rs', () => {
    let request;

    before(() => {
        request = chai.request(process.env.API_BASE_URL);
    });

    it ('Gets information about users payment', (done) => {
       request.post('/payment')
           .send({
            'order_id': 628,
            'user_id': process.env.USER_ID,
            'status': "paid",
            'amount': 80.54
           })
           .end((error, response) => {
               response.should.have.status(200);
               done();
           });
    });
});