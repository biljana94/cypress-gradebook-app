/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')

let userData = {
    email: 'test@example.com',
    password: 'testtest123'
}

describe('Logout', () => {
    before('Login', () => {
        cy.visit('/')
        cy.loginCommand(userData.email, userData.password)
        cy.url().should('contains', '/')
        cy.get(locators.homePageGradebooks.pageTitle).should('be.visible').and('contain.text', ' All Gradebooks Page')
        cy.get(locators.header.logoutButton).should('be.visible')
    })

    it('Logout test', () => {
        cy.get(locators.header.logoutButton).should('be.visible').click()
        cy.url().should('contains', '/login')
        cy.get(locators.header.loginButton).should('be.visible')
    })
})