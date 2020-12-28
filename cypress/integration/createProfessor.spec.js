/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let data = {
    email: 'test@example.com',
    password: 'testtest123',
    randomFirstName: faker.name.firstName(),
    randomLastName: faker.name.lastName(),
    randomImage: faker.image.avatar()
}

describe('New Professor', () => {
    beforeEach('Login', () => {
        cy.visit('/')
        cy.loginCommand(data.email, data.password)
    })

    it('Create Professor with valid data', () => {
        cy.get(locators.header.professors.professorsDropdown).click()
        cy.get(locators.header.professors.createProfessor).click()
        cy.url().should('contains', '/create-professor')
        cy.get(locators.createProfessor.pageTitle).should('contain.text', 'Create Professor')
        cy.get(locators.createProfessor.firstName).type(data.randomFirstName)
        cy.get(locators.createProfessor.lastName).type(data.randomLastName)
        cy.get(locators.createProfessor.addImageButton).click()
        cy.get(locators.createProfessor.addImageInput).type(data.randomImage)
        cy.get(locators.createProfessor.buttonSubmit).click()
        cy.url().should('contains', '/all-professors')
        cy.get(locators.allProfessors.pageTitle).should('contain.text', 'All Professors Page')
        cy.get(locators.allProfessors.filterField).type(data.randomFirstName).type('{enter}')
        cy.get('tbody > tr > :nth-child(1)').should('contain.text', data.randomFirstName)
        cy.get('tbody > tr > :nth-child(2)').should('contain.text', data.randomLastName)
    })

    it('Create Professor without image', () => {
        cy.get(locators.header.professors.professorsDropdown).click()
        cy.get(locators.header.professors.createProfessor).click()
        cy.url().should('contains', '/create-professor')
        cy.get(locators.createProfessor.pageTitle).should('contain.text', 'Create Professor')
        cy.get(locators.createProfessor.lastName).type(data.randomLastName)
        cy.get(locators.createProfessor.addImageButton).click()
        cy.get(locators.createProfessor.addImageInput).type(data.randomImage)
        cy.get(locators.createProfessor.buttonSubmit).click()
        cy.get(locators.createProfessor.firstName).then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.')
            // cy.log($input)
        })
    })
})