// https://on.cypress.io/custom-commands
// ***********************************************
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

//LOGIN COMMAND
//komanda ne radi jer nema rute https://gradebook-api.vivifyideas.com/api/auth/login ?????
Cypress.Commands.add('loginCommand', (username, pass) => {
    cy.request({
        method: 'POST',
        url: 'https://gradebook-api.vivifyideas.com/api/login',
        body: {
            email: username,
            password: pass
        }
    }).its('body').then((response) => {
        window.localStorage.setItem('loginToken', response.token)
        // console.log(response)
    })
})