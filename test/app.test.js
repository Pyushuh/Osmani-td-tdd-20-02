const {assert} = require("chai");
const Cube = require('../src/app').Cube;
const Panier = require('../src/app').Panier;
const Article = require('../src/app').Article;
const expect = require('chai').expect;
//tests du cube
describe('Testing the Cube Functions', function () {
    it('1. The side length of the Cube', function (done) {
        let c1 = new Cube(2);
        expect(c1.getSideLength()).to.equal(2);
        done();
    });

    it('2. The surface area of the Cube', function (done) {
        let c2 = new Cube(5);
        expect(c2.getSurfaceArea()).to.equal(150);
        done();
    });

    it('3. The volume of the Cube', function (done) {
        let c3 = new Cube(7);
        expect(c3.getVolume()).to.equal(343);
        done();
    });

});

describe('Tests de la classe Panier', function () {
    let panier;
    let article1, article2, article3;
    //Créer les articles avec ces valeurs avant d'exécuter chaque fonction de test
    beforeEach(function () {
        panier = new Panier();
        article1 = new Article("Jeans", 53);
        article2 = new Article("Baskets", 129.99);
        article3 = new Article("T-shirt", 34);
    });

    it('devrait ajouter un article au panier', function () {
        panier.ajouterArticle(article1);
        assert.equal(panier.articles.length, 1);
        assert.include(panier.articles, article1);
    });

    it('devrait retirer un article du panier', function () {
        panier.ajouterArticle(article1);
        panier.ajouterArticle(article2);
        panier.retirerArticle(article1);
        assert.equal(panier.articles.length, 1);
        assert.notInclude(panier.articles, article1);
    });

    it('devrait calculer le montant total du panier', function () {
        panier.ajouterArticle(article1);
        panier.ajouterArticle(article2);
        panier.ajouterArticle(article3);
        const montantTotal = panier.calculerMontantTotal();
        assert.equal(montantTotal, article1.prix + article2.prix + article3.prix);
    });

    it('devrait vider le panier', function () {
        panier.ajouterArticle(article1);
        panier.viderPanier();
        assert.isEmpty(panier.articles);
    });
});