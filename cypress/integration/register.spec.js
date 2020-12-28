/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let userData = {
    randomFirstName: faker.name.firstName(),
    randomLastName: faker.name.lastName(),
    randomPassword: faker.internet.password() + '1',
    randomEmail: faker.internet.email()
}

// Kao neulogovan korisnik imam mogućnost da pristupim Register stranici (/register) i da kreiram novi account preko nje. 
//Na stranici vidim polja: first name, last name, email, password, confirm password, checkbox za “I accept terms and conditions”, i button “Register”. 

//Potrebno je postaviti validaciju na polja:
// First name: required,max:255x
// Last name: required, max:255
// Email: required, email, max:255
// Password: confirmed, at least 8 chars, at least 1 digit
// Accepted terms and conditions

// U slučaju da uneti podaci nisu validni, potrebno je da dobijem informaciju o tome. 
//Ako su podaci validni, registrovan sam i automatski ulogovan u aplikaciju, te preusmeren na početnu stranicu (/). 
//Register stranici ne mogu da pristupim kao ulogovan korisnik.
// Prilikom svake registracije, korisnik koji je registrovan automatski postaje i profesor.


describe('Register test', () => {
    beforeEach('Visit Register page of Gradebook App', () => {
        cy.visit('/')
        cy.url().should('contains', 'https://gradebook')
        cy.get(locators.header.registerButton).click()
        cy.url().should('contains', '/register')
        cy.get(locators.register.formTitle).should('contain.text', 'Register')
    })

    // POSITIVE TEST
    it('Register with valid credentials', () => {
        cy.get(locators.register.firstName).type(userData.randomFirstName)
        cy.get(locators.register.lastName).type(userData.randomLastName)
        cy.get(locators.register.password).type(userData.randomPassword)
        cy.get(locators.register.confirmPassword).type(userData.randomPassword)
        cy.get(locators.register.email).type(userData.randomEmail)
        cy.get(locators.register.checkboxTerms).check()
        cy.get(locators.register.buttonSubmit).click()
        cy.url().should('contains', '/gradebooks') // asertacija - da li se posle registracije ide na homePage
        // cy.get(locators.header.registerButton).should('not.be.visible')
        cy.get(locators.header.logoutButton).should('be.visible') // asertacija - da li se vidi logout button
        cy.get(locators.homePageGradebooks.pageTitle).should('contain.text', ' All Gradebooks Page')
    })

    it('Register user should be professor', () => {
        cy.get(locators.header.loginButton).click()
        cy.get(locators.login.email).type(userData.randomEmail)
        cy.get(locators.login.password).type(userData.randomPassword)
        cy.get(locators.login.buttonSubmit).click()
        cy.get(locators.header.professors.professorsDropdown).click()
        cy.get(locators.header.professors.allProfessorsButton).click()
        cy.get(locators.allProfessors.pageTitle).should('contain.text', 'All Professors Page')
        cy.get(locators.allProfessors.filterField).type(userData.randomFirstName).type('{enter}')
        cy.get('tbody > tr > :nth-child(1)').should('contain.text', userData.randomFirstName)
        cy.get('tbody > tr > :nth-child(2)').should('contain.text', userData.randomLastName)
    })

    // NEGATIVE TEST
    // First and Last Name should contains max 255 characters
    // Random string generator site: http://www.unit-conversion.info/texttools/random-string-generator/
    it('Register with all invalid data and empty fields', () => {
        cy.get(locators.register.firstName).then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.')
        })
        cy.get(locators.register.lastName).then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill out this field.')
            // cy.log($input)
        })
        cy.get(locators.register.password).type('test').then(($input) => {
            expect($input[0].validationMessage).to.eq('Please match the requested format.')
            // cy.log($input)
        })
        cy.get(locators.register.confirmPassword).type('test')
        cy.get(locators.register.email).type('@example.com').then(($input) => {
            expect($input[0].validationMessage).to.eq("Please enter a part followed by '@'. '@example.com' is incomplete.")
        })
        cy.get(locators.register.buttonSubmit).click()
        cy.wait(3000)
        cy.url().should('contains', '/register')
    })
})