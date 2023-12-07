/// <reference types="Cypress" />
import data from "../../fixtures/data.json";

describe("Prueba de APIs",() => {

    beforeEach(() => {
        cy.visit("/");
    })
    
    it("Test people", () => {        
        cy.request("people/2/");
    })

    it("Test people", () => {
        //Test the endpoint people/2/ and check the success response, the skin color to be 
        //gold, and the amount of films it appears on (should be 6).
        cy.request({
            url:"people/2",
        }).then(respuesta => {
            expect(respuesta.status).to.eq(200);
            expect(respuesta.body).to.have.property('skin_color', "gold");
            expect(respuesta.body).to.have.property('films').length(6);
        })
    })

    it("Chain request Test movie", () => {
        //Request the endpoint of the second movie in which people/2/ was
        //present (using the response from people/2/). Check the release
        //date to be in the correct date format, and the response to include
        //characters, planets, starships, vehicles and species, each element 
        //including more than 1 element.
        cy.request({
            method: 'GET',
            url:"people/2",
        }).then(respuesta => {
            expect(respuesta.status).to.eq(200);
            expect(respuesta.body).to.have.property('films').length(6);
            const movie = respuesta.body.films[1];
            return movie;
        }).then(movie => {
            cy.request({
                method:'GET',
                url:movie,
            }).then( respuesta => {
                expect(respuesta.status).to.eq(200);
                expect(respuesta.body).to.have.property('release_date', "1980-05-17");
                expect(respuesta.body).to.have.property('characters').to.have.length.greaterThan(1);
                expect(respuesta.body).to.have.property('planets').to.have.length.greaterThan(1);
                expect(respuesta.body).to.have.property('starships').to.have.length.greaterThan(1);
                expect(respuesta.body).to.have.property('vehicles').to.have.length.greaterThan(1);
                expect(respuesta.body).to.have.property('species').to.have.length.greaterThan(1);
            })
        })
    })

    it("Planet", () => {
        //Request the endpoint of the first planet present in the last film's 
        //response (using the previous response). Check the gravity and the terrains 
        //matching the exact same values returned by the request (Use fixtures to store 
        //and compare the data of terrains and gravity).
        cy.request({
            method: 'GET',
            url:"people/2",
        }).then(respuesta => {
            expect(respuesta.status).to.eq(200);
            const lastMovie = respuesta.body.films[respuesta.body.films.length-1];
            return lastMovie
        }).then(lastMovie => {
            cy.request({
                method:'GET',
                url:lastMovie,
            }).then( respuesta => {
                expect(respuesta.status).to.eq(200);
                const planet = respuesta.body.planets[0];
                return planet
            }).then(planet => {
                cy.request({
                    method: 'GET',
                    url:planet,
                }).then( respuesta => {
                    expect(respuesta.status).to.eq(200);
                    expect(respuesta.body).to.have.property('gravity', data.gravity);
                    expect(respuesta.body).to.have.property('terrain', data.terrain);
                })
            })
        })
    })

    it.only("Grab url", () => {
        //On the same response from the planet, grab the url element on the response, 
        //and request it. Validate the response being exactly the same from the previous one.
        let url;
        cy.request({
            method: 'GET',
            url:"people/2",
        }).then(respuesta => {
            expect(respuesta.status).to.eq(200);
            const lastMovie = respuesta.body.films[respuesta.body.films.length-1];
            return lastMovie
        }).then(lastMovie => {
            cy.request({
                method:'GET',
                url:lastMovie,
            }).then( respuesta => {
                expect(respuesta.status).to.eq(200);
                const planet = respuesta.body.planets[0];
                url = planet;
                return planet
            }).then(planet => {
                cy.request({
                    method: 'GET',
                    url:planet,
                }).then( respuesta => {
                    expect(respuesta.status).to.eq(200);
                    expect(respuesta.body).to.have.property('url', url);
                })
            })
        })
    })
})