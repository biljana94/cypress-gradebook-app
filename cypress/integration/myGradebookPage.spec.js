/// <reference types="Cypress"/>

const locators = require('../fixtures/locators.json')
const faker = require('faker')

let data = {
    email: 'test@example.com',
    password: 'testtest123',
    randomImage: faker.image.avatar(),
    userId: '',
    userFirstName: '',
    userLastName: '',
    singleGradebookId: '',
    gradebookTitle: '',
    randomWord: faker.lorem.word()
}

let student = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    image: faker.image.avatar()
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
            // console.log('****************************************************************')
            // console.log(response)
            // console.log('****************************************************************')
            data.singleGradebookId = response.response.body.id
            data.gradebookTitle = response.response.body.title
            // console.log(data.singleGradebookId + 'single gradebook id')
        })
        cy.url().should('contains', `/my-gradebook/${data.userId}`)
        cy.get(locators.myGradebook.pageTitle).should('be.visible').and('have.text', 'My Gradebook Page')
        cy.get(locators.myGradebook.gradebookTitle).should('be.visible')
        cy.get(locators.myGradebook.professorName).should('be.visible').and('contain.text', data.userFirstName + ' ' + data.userLastName)
        cy.get(locators.myGradebook.studentsList).should('be.visible').then(($list) => {
            // console.log($list)
            if(!$list === '') {
                return expect($list).to.contain('You do not have an assigned student')
            } else {
                return $list
            }
        })
    })

    it('Add New Student', () => {
        // console.log(data.singleGradebookId + 'OVO MI TREBA')
        cy.get(locators.header.myGradebook).eq(1).should('be.visible').click()
        cy.url().should('contains', `/my-gradebook/${data.userId}`)
        cy.wait(2000)
        cy.get(locators.myGradebook.gradebookTitle).then(($diary) => {
            // console.log(data.singleGradebookId + 'OVO MI TREBA')
            if($diary === '') {
                cy.get(locators.myGradebook.addNewStudent.addStudentButton).eq(0).should('be.visible').click()
                cy.get(locators.myGradebook.addNewStudent.noDiaryValidation).should('be.visible')
            } else {
                cy.get(locators.myGradebook.addNewStudent.addStudentButton).eq(0).should('be.visible').click()
                cy.url().should('contains', `/my-gradebook/add-student/${data.singleGradebookId}`)
                cy.get(locators.myGradebook.addNewStudent.studentFirstName).should('be.visible').type(student.firstName)
                cy.get(locators.myGradebook.addNewStudent.studentLastName).should('be.visible').type(student.lastName)
                cy.get(locators.myGradebook.addNewStudent.addImgButton).should('be.visible').eq(0).click()
                cy.get(locators.myGradebook.addNewStudent.studentImg).should('be.visible').type(student.image)
                cy.get(locators.myGradebook.addNewStudent.submitButton).eq(4).click()
                cy.url().should('contains', `/single-gradebook/${data.singleGradebookId}`)
            }
        })
    })

    it('Edit Gradebook', () => {
        cy.get(locators.header.myGradebook).eq(1).should('be.visible').click()
        cy.url().should('contains', `/my-gradebook/${data.userId}`)
        cy.get(locators.myGradebook.editGradebook.buttonEditGradebook).should('be.visible').click()
        cy.url().should('contains', `/single-gradebook/${data.singleGradebookId}/edit`)
        cy.wait(5000)
        cy.get(locators.myGradebook.editGradebook.title).should('be.visible').and('have.value', data.gradebookTitle).type(' ' + data.randomWord)
        cy.get(locators.myGradebook.editGradebook.submitButton).should('be.visible').click()
        cy.url().should('contains', '/gradebooks')
        cy.get(locators.header.myGradebook).eq(1).click()
        cy.get(locators.myGradebook.gradebookTitle).should('be.visible').and('have.text', data.gradebookTitle + ' ' + data.randomWord)
    })
})