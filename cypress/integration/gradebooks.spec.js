/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let userData = {
    email: 'test@example.com',
    password: 'testtest123'
}

describe('Gradebooks homepage', () => {
    beforeEach('Login', () => {
        cy.visit('/')
        cy.get(locators.header.loginButton)
        cy.get(locators.login.email).type(userData.email)
        cy.get(locators.login.password).type(userData.password)
        cy.get(locators.login.buttonSubmit).click()
    })

    it('Homepage visibility', () => {
        cy.get(locators.homePageGradebooks.table).then((response) => {
            // cy.log(response)
            let dataLength = response[0].tBodies.length
            // cy.log(data)
            expect(dataLength).to.equal(10)
            // let gradebook = response[0].children
            // cy.log(response[0].children)
        })
    })
})