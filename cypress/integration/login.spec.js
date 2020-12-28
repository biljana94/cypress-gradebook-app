/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let userData = {
    email: 'test@example.com',
    password: 'testtest123'
}

describe('Login', () => {
    before('Visit app', () => {
        cy.visit('/')
    })

    it('Login with valid credetials', () => {
        cy.get(locators.header.loginButton).click()
        cy.url().should('contains', '/login')
        cy.get(locators.login.email).type(userData.email)
        cy.get(locators.login.password).type(userData.password)
        cy.get(locators.login.buttonSubmit).click()
        cy.wait(3000)
        cy.url().should('contains', '/')
        cy.get(locators.homePageGradebooks.pageTitle).should('contain.text', ' All Gradebooks Page')
        cy.get(locators.header.logoutButton).should('be.visible')
    })
})