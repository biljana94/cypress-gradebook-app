/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let userData = {
    randomFirstName: faker.name.firstName(),
    randomLastName: faker.name.lastName(),
    randomPassword: faker.internet.password() + '1',
    randomEmail: faker.internet.email()
}

describe('Register test', () => {
    beforeEach('Visit Register page of Gradebook App', () => {
        cy.visit('/')
        cy.url().should('contains', 'https://gradebook')
        cy.get(locators.header.registerButton).click()
        cy.url().should('contains', '/register')
        cy.get(locators.register.formTitle).should('contain.text', 'Register')
    })

    it('Register with valid credentials', () => {
        cy.get(locators.register.firstName).should('be.visible').type(userData.randomFirstName)
        cy.get(locators.register.lastName).should('be.visible').type(userData.randomLastName)
        cy.get(locators.register.password).should('be.visible').type(userData.randomPassword)
        cy.get(locators.register.confirmPassword).should('be.visible').type(userData.randomPassword)
        cy.get(locators.register.email).should('be.visible').type(userData.randomEmail)
        cy.get(locators.register.checkboxTerms).should('be.visible').check()
        cy.get(locators.register.buttonSubmit).should('be.visible').click()
        cy.url().should('contains', '/gradebooks') // asertacija - da li se posle registracije ide na homePage
        // cy.get(locators.header.registerButton).should('not.be.visible')
        cy.get(locators.header.logoutButton).should('be.visible') // asertacija - da li se vidi logout button
        cy.get(locators.homePageGradebooks.pageTitle).should('contain.text', ' All Gradebooks Page')
    })

    it('Register user should be professor', () => {
        cy.get(locators.header.loginButton).click()
        cy.loginCommand(userData.randomEmail, userData.randomPassword) //login preko komande
        cy.get(locators.header.professors.professorsDropdown).should('be.visible').click()
        cy.get(locators.header.professors.allProfessorsButton).should('be.visible').click()
        cy.get(locators.allProfessors.pageTitle).should('be.visible').and('contain.text', 'All Professors Page')
        cy.get(locators.allProfessors.filterField).should('be.visible').type(userData.randomFirstName).type('{enter}')
        cy.get('tbody > tr > :nth-child(1)').should('contain.text', userData.randomFirstName)
        cy.get('tbody > tr > :nth-child(2)').should('contain.text', userData.randomLastName)
    })

    it('Register with all invalid data and empty fields', () => {
        cy.get(locators.register.firstName).should('be.visible').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.')
        })
        cy.get(locators.register.lastName).should('be.visible').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.')
            // cy.log($input)
        })
        cy.get(locators.register.password).should('be.visible').type('test').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please match the requested format.')
            // cy.log($input)
        })
        cy.get(locators.register.confirmPassword).should('be.visible').type('test')
        cy.get(locators.register.email).should('be.visible').type('@example.com').then(($input) => {
            expect($input[0].validationMessage).to.eq("Please enter a part followed by '@'. '@example.com' is incomplete.")
        })
        cy.get(locators.register.buttonSubmit).should('be.visible').click()
        cy.wait(3000)
        cy.url().should('contains', '/register')
    })
})