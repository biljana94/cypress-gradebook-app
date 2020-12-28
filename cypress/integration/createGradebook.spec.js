/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

//Kada kao ulogovan korisnik pristupim URL-u “/gradebooks/create”, otvara se ova stranica. 
//Na stranici se prikazuje forma za dodavanje novog dnevnika gde vidim:

// Naziv, obavezno polje, minimum 2 karaktera, maksimum 255
// Select box za biranje Razrednog starešine

// Napomena: 
// Što se tiče dodavanja razrednog starešine:
// U listi vidimo samo Profesore koji predhodno nisu razredne starešine, (vučemo postojeće podatke iz baze)

// Na kraju forme imam dugme “Submit”. Ako su podaci neispravni, dobijam validacione poruke. 
//Ako su podaci ispravni, dnevnik je dodat i preusmeren sam na stranicu “Gradebooks”.

// Pored dugmeta “Submit” imam i dugme “Cancel” koje me preusmerava na “Gradebooks” stranicu.

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
        cy.get(locators.createGradebook.professor).select('Biljana Jelaca')
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