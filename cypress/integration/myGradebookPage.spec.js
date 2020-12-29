/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

//Kada kao korisnik pristupim ovoj stranici, vidim svoj dnevnik (na kome sam dodeljen kao razredni starešina). 
//Vidim naziv razrednog staresine (u ovom slucaju moje ime), kao i liste učenika. 
//Ukoliko nemam dodeljenog ni jednog učenika prikazujemo odgovarajucu poruku. 
//U gornjem levom uglu se nalazi dugme “Add New Students”. 
//Klikom na njega otvara se nova stranica za dodavanje učenika (‘/gradebooks/:id/students/create’). 
//Ukoliko nisam dodeljen kao razredni starešina ni na jedan dnevnik prikazuje mi se samo odgovarajuća poruka.

let data = {
    email: 'test@example.com',
    password: 'testtest123',
    randomImage: faker.image.avatar(),
    userId: '',
    userFirstName: '',
    userLastName: '',
    singleGradebookId: ''
}

describe('My Gradebook', () => {
    beforeEach('Login and get user id', () => {
        cy.visit('/')
        // intercept() - definisemo PRESRETANJE requesta da bi mogli da dobijemo sve podatke o loginu (ovde dobijamo i request i response)
        // as() je alias - definisemo naziv tog naseg intercepta, tj kojim imenom cemo ga kasnije pozvati
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login', (req) => {

        }).as('successfulLogin')
        cy.loginCommand(data.email, data.password) // logujemo se u aplikaciju
        // cekamo da se uradi login i uzimamo response. Iz responsa vadimo userId, userFirstName, userLastName
        cy.wait('@successfulLogin').then((response) => {
            // console.log(response.response.body.user.id)
            data.userId = response.response.body.user.id
            data.userFirstName = response.response.body.user.firstName
            data.userLastName = response.response.body.user.lastName
        })
    })

    it('Gradebook visibility', () => {
        cy.intercept('GET', `https://gradebook-api.vivifyideas.com/api/diaries/my-diary/${data.userId}`, (req) => {

        }).as('successfulGetMyGradebook')
        cy.get(locators.header.myGradebook).eq(1).should('be.visible').click()
        cy.wait('@successfulGetMyGradebook').then((response) => {
            // console.log(response.response.body.id)
            data.singleGradebookId = response.response.body.id
        })
        cy.url().should('contains', `/my-gradebook/${data.userId}`)
        cy.get(locators.myGradebook.pageTitle).should('be.visible').and('have.text', 'My Gradebook Page')
        cy.get(locators.myGradebook.gradebookTitle).should('be.visible').and('have.text', 'test')
        cy.get(locators.myGradebook.professorName).should('be.visible').and('contain.text', data.userFirstName + ' ' + data.userLastName)
        cy.get(locators.myGradebook.studentsList).should('be.visible').then(($list) => {
            console.log($list)
            if(!$list === '') {
                return expect($list).to.contain('You do not have an assigned student')
            } else {
                return $list
            }
        })
        cy.get(locators.myGradebook.addNewStudent.addStudentButton).eq(0).should('be.visible').click()
        cy.url().should('contains', `/my-gradebook/add-student/${data.singleGradebookId}`)
    })

    it('Add New Student', () => {
        cy.get(locators.header.myGradebook).eq(1).should('be.visible').click()
        cy.url().should('contains', `/my-gradebook/${data.userId}`)
        cy.wait(2000)
        cy.get(locators.myGradebook.gradebookTitle).then(($diary) => {
            if($diary === '') {
                cy.get(locators.myGradebook.addNewStudent.addStudentButton).eq(0).should('be.visible').click()
                return cy.get(locators.myGradebook.addNewStudent.noDiaryValidation).should('be.visible')
            } else {
                cy.get(locators.myGradebook.addNewStudent.addStudentButton).eq(0).should('be.visible').click()
                return cy.url().should('contains', `/my-gradebook/add-student/${data.singleGradebookId}`)
            }
        })
    })
})