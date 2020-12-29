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
        // cy.get(locators.header.loginButton)
        // cy.get(locators.login.email).type(userData.email)
        // cy.get(locators.login.password).type(userData.password)
        // cy.get(locators.login.buttonSubmit).click()
        cy.loginCommand(userData.email, userData.password)
    })

    it('Homepage visibility', () => {
        cy.get(locators.homePageGradebooks.table).then((response) => {
            // cy.log(response)
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
        cy.get(locators.homePageGradebooks.inputFilter).should('be.visible').type(filterData.uppercaseWord)
        cy.get(locators.homePageGradebooks.buttonSearch).eq(0).should('be.visible').click()
    })
})