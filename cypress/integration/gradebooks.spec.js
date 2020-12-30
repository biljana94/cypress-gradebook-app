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


    //Kao korisnik na vrhu home stranice vidim input polje preko kojeg mogu da filtriram dnevnike. 
    //Kada ukucam termin i kliknem na dugme “Filtriraj” koje se nalazi pored, 
    //prikazuju mi se samo dnevnici koji imaju ukucan termin u imenu dnevnika (podrazumeva se partial term kao i case insensitive). 
    //Paginacija se i dalje prikazuje i klikom na “load more” dugme se učitava novih 10 dnevnika koji zadovoljavaju kriterijume filtera.

    it('Homepagefilter - case sensitive test', () => {
        cy.visit('/')
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/search?search_term=DNEVNIK&page=1', (req) => {

        }).as('getSearchResults')
        cy.get(locators.homePageGradebooks.inputFilter).should('be.visible').type(filterData.uppercaseWord)
        cy.get(locators.homePageGradebooks.buttonSearch).eq(0).should('be.visible').click()
        cy.wait('@getSearchResults').then((response) => {
            // console.log(response.response.body.data)
            filterData.arrResultUppercase = response.response.body.data
            filterData.arrResultUppercase.forEach(($e) => {
                expect($e.title).to.contains('Dnevnik', { matchCase: false }) // OVO NE RADI!!!!!
            })
        })
        
        // cy.get(locators.homePageGradebooks.buttonNext).eq(2).should('be.visible').click()
    })
})