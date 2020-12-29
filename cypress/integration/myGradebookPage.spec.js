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
    userId: ''
}

describe('My Gradebook', () => {
    beforeEach('Login and get user id', () => {
        cy.visit('/')
        // intercept() - definisemo PRESRETANJE requesta da bi mogli da dobijemo sve podatke o loginu (ovde dobijamo i request i response)
        // as() je alias - definisemo naziv tog naseg intercepta, tj kojim imenom cemo ga kasnije pozvati
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login', (req) => {

        }).as('successfulLogin')
        cy.loginCommand(data.email, data.password) // logujemo se u aplikaciju
        // cekamo da se uradi login i uzimamo response. Iz responsa vadimo userId
        cy.wait('@successfulLogin').then((response) => {
            console.log(response.response.body.user.id)
            data.userId = response.response.body.user.id
        })
    })

    it('Gradebook visibility', () => {})
})