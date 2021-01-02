/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let data = {
    email: 'test@example.com',
    password: 'testtest123',
    randomTitle: faker.name.title()
}

describe('New Gradebook', () => {
    beforeEach('Login', () => {
        cy.visit('/')
        cy.loginCommand(data.email, data.password)
    })

    it('Create New Gradebook with valid data', () => {
        cy.get(locators.header.createGradebook).click()
        cy.get(locators.createGradebook.pageTitle).should('contain.text', 'Create Gradebook Page')
        cy.get(locators.createGradebook.title).type(data.randomTitle)
        cy.get(locators.createGradebook.professor).select('103')
        cy.get(locators.createGradebook.buttonSubmit).click()
        cy.url().should('contains', '/')
    })

    it('Create gradebook without professor', () => {
        cy.get(locators.header.createGradebook).click()
        cy.get(locators.createGradebook.pageTitle).should('contain.text', 'Create Gradebook Page')
        cy.get(locators.createGradebook.title).type(data.randomTitle)
        cy.get(locators.createGradebook.buttonSubmit).click()
        cy.get('.alert > :nth-child(1) > div').should('contain.text', '\n          [\n  "The professor id field is required."\n]\n        ')
    })
})