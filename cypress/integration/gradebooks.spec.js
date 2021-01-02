/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let userData = {
    email: 'test@example.com',
    password: 'testtest123'
}

let filterData = {
    uppercaseWord: 'DNEVNIK',
    arrResultUppercase: []
}

describe('Gradebooks homepage', () => {
    beforeEach('Login', () => {
        cy.visit('/')
        cy.loginCommand(userData.email, userData.password)
    })

    it('Homepage visibility', () => {
        cy.get(locators.homePageGradebooks.table).then((response) => {
            let dataLength = response[0].tBodies.length
            if(dataLength === 0) {
                return cy.get(locators.homePageGradebooks.noDiariesMessage).should('be.visible')
            } else {
                return expect(dataLength).to.equal(10)
            }
        })
    })

    it('Homepagefilter (case sensitive test)', () => {
        cy.visit('/')
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/search?search_term=DNEVNIK&page=1', (req) => {

        }).as('getSearchResults')
        cy.get(locators.homePageGradebooks.inputFilter).should('be.visible').type(filterData.uppercaseWord)
        cy.get(locators.homePageGradebooks.buttonSearch).eq(0).should('be.visible').click()
        cy.wait('@getSearchResults').then((response) => {
            // console.log(response.response.body.data)
            filterData.arrResultUppercase = response.response.body.data
            filterData.arrResultUppercase.forEach(($e) => {
                let title = $e.title.toLowerCase()
                let filteredWord = filterData.uppercaseWord.toLowerCase()
                expect(title).to.include(filteredWord)
            })
        })
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/search?search_term=DNEVNIK&page=2', (req) => {

        }).as('sec')
        cy.get(locators.homePageGradebooks.buttonNext).eq(2).should('be.visible').click()
        cy.wait('@sec').then((response) => {
            filterData.arrResultUppercase = response.response.body.data
            filterData.arrResultUppercase.forEach(($e) => {
                let title = $e.title.toLowerCase()
                let filteredWord = filterData.uppercaseWord.toLowerCase()
                expect(title).to.include(filteredWord)
            })
        })
    })
})