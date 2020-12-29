/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let userData = {
    email: 'test@example.com',
    password: 'testtest123'
}

describe('Login', () => {
    beforeEach('Visit app', () => {
        cy.visit('/')
    })

    it('Login with valid credetials', () => {
        cy.get(locators.header.loginButton).should('be.visible').click()
        cy.url().should('contains', '/login')
        cy.get(locators.login.email).should('be.visible').type(userData.email)
        cy.get(locators.login.password).should('be.visible').type(userData.password)
        cy.get(locators.login.buttonSubmit).should('be.visible').click()
        cy.url().should('contains', '/')
        cy.get(locators.homePageGradebooks.pageTitle).should('be.visible').and('contain.text', ' All Gradebooks Page')
        cy.get(locators.header.logoutButton).should('be.visible')
    })

    //Test pada jer nema ocekivane validacione poruke za invalid email
    it('Login with invalid email', () => {
        cy.get(locators.header.loginButton).should('be.visible').click()
        cy.url().should('contains', '/login')
        cy.get(locators.login.email).should('be.visible').type('@example.com').then(($input) => {
            expect($input[0].validationMessage).to.eq("Please enter a part followed by '@'. '@example.com' is incomplete.")
        })
        cy.get(locators.login.password).should('be.visible').type(userData.password)
        cy.get(locators.login.buttonSubmit).should('be.visible').click()
        cy.url().should('contains', '/login')
        cy.get(locators.header.loginButton).should('be.visible')
        cy.get(locators.header.registerButton).should('be.visible')
    })

    it('Login with invalid password', () => {
        cy.get(locators.header.loginButton).should('be.visible').click()
        cy.url().should('contains', '/login')
        cy.get(locators.login.email).should('be.visible').type(userData.email)
        cy.get(locators.login.password).should('be.visible').type('asd').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please match the requested format.')
            // cy.log($input)
        })
        cy.get(locators.login.buttonSubmit).should('be.visible').click()
        cy.url().should('contains', '/login')
        cy.get(locators.header.loginButton).should('be.visible')
        cy.get(locators.header.registerButton).should('be.visible')
    })
})