const {assert} = require("chai");
const Cube = require('../src/app').Cube;
const Panier = require('../src/app').Panier;
const Article = require('../src/app').Article;
const Stock = require('../src/app').Stock;
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
    let articleErrrone;
    let remise;
    let coupon;
    let couponNegatif;
    let couponSuperieur

    // Créer les articles avec ces valeurs avant d'exécuter chaque fonction de test
    beforeEach(function () {
        panier = new Panier();
        article1 = new Article("Jeans", 53);
        article2 = new Article("Baskets", 129.99);
        article3 = new Article("T-shirt", 34);
        articleErrrone = new Article("T-shirt frauduleux", -34);
        remise = 20;
        coupon =10;
        couponNegatif = -20;
        couponSuperieur = 120;
    });

    it('devrait ajouter un article au panier', function () {
        panier.ajouterArticle(article1);
        assert.equal(panier.articles.length, 1);
        assert.include(panier.articles, article1);
    });

    it('ne devrait pas ajouter un article au panier', function () {
        panier.ajouterArticle(articleErrrone);
        assert.equal(panier.articles.length, 0);
    });

    it('devrait retirer un article du panier', function () {
        panier.ajouterArticle(article1);
        panier.ajouterArticle(article2);
        panier.retirerArticle(article1);
        assert.equal(panier.articles.length, 1);
        assert.notInclude(panier.articles, article1);
    });

    it('devrait calculer le montant total du panier sans remise', function () {
        panier.ajouterArticle(article1);
        panier.ajouterArticle(article2);
        panier.ajouterArticle(article3);
        panier.ajouterArticle(articleErrrone);
        const montantTotal = panier.calculerMontantTotal();
        assert.equal(montantTotal, article1.prix + article2.prix + article3.prix);
    });

    it('devrait calculer le montant total du panier avec remise', function () {
        panier.ajouterArticle(article1);
        panier.ajouterArticle(article2);
        panier.ajouterArticle(article3);
        panier.appliquerRemise(remise);
        const montantTotalAvecRemise = panier.calculerMontantTotal();
        assert.isBelow(montantTotalAvecRemise, article1.prix + article2.prix + article3.prix);
        assert.isAbove(montantTotalAvecRemise, 0);
    });

    it('devrait vider le panier et réinitialiser la remise', function () {
        panier.ajouterArticle(article1);
        panier.appliquerRemise(remise);
        panier.viderPanier();
        assert.isEmpty(panier.articles);
        assert.isFalse(panier.remiseAppliquee);
    });

    it('devrait appliquer un coupon sur un article du panier', function () {
        panier.ajouterArticle(article1);
        panier.ajouterCouponSurArticle(article1, coupon); // Le coupon réduit le prix de 10%
        assert.equal(article1.prix, 47.7);
    });

    it('ne devrait pas appliquer un coupon sur un article utilisant déjà un coupon', function () {
        panier.ajouterArticle(article1);
        panier.ajouterCouponSurArticle(article1, coupon);
        panier.ajouterCouponSurArticle(article1, 30);
        assert.equal(article1.prix, 47.7);
    });

    it('ne devrait pas appliquer le coupon si la remise est inférieure à 0', function () {
    });

    it('ne devrait pas appliquer le coupon si la remise est supérieure au prix fort de l\'article', function () {
    });
});

describe('Tests de la classe Stock', function () {
    let stock;
    let article1, article2, article3;

    beforeEach(function () {
        stock = new Stock();
        article1 = new Article("Jeans", 53);
        article2 = new Article("Baskets", 129.99);
        article3 = new Article("T-shirt", 34);
    });

    it('devrait ajouter des produits au stock', function () {
        stock.ajouterArticle(article1, 50);
        stock.ajouterArticle(article2, 30);
        assert.equal(stock.articles.length, 2);
    });

    it('devrait supprimer des produits du stock', function () {
        stock.ajouterArticle(article1, 50);
        stock.ajouterArticle(article2, 30);
        stock.ajouterArticle(article3, 20);

        stock.retirerArticle(article1);
        assert.equal(stock.articles.length, 2);
        assert.notInclude(stock.articles, article1);
    });

    it('devrait vérifier que la quantité de produits est correcte après un ajout', function () {
        stock.ajouterArticle(article1, 50);
        assert.equal(stock.getQuantiteArticle(article1), 50);
    });

    it('ne devrait pas avoir une quantité de stock négative', function () {
        stock.ajouterArticle(article1, 50);
        stock.retirerStockArticle(article1, 60);
        assert.equal(stock.getQuantiteArticle(article1), 0);
    });

    it('ne devrait pas avoir de produit périmé', function () {
        const datePeremption = new Date();
        datePeremption.setDate(datePeremption.getDate() - 1); // Hier
        article1.dateAjout = datePeremption;

        stock.ajouterArticle(article1, 50);

        const articlesPerimes = stock.getArticlesPerimes();
        assert.isEmpty(articlesPerimes);
    });

    it('devrait avoir une cohérence dans la périodicité d’évolution du stock', function () {
        const dateDebut = new Date("2024-02-01");
        const dateFin = new Date("2024-02-10");

        stock.ajouterArticle(article1, 50);
        stock.ajouterArticle(article2, 30);
        stock.ajouterArticle(article3, 20);

        const evolutions = stock.evolutionsStock(dateDebut, dateFin);

        assert.equal(evolutions.length, 3);

        evolutions.forEach(evolution => {
            if (evolution.quantite) { // Vérifier si le tableau est défini
                const joursEntreDates = dateFin > evolution.quantite[0]?.date
                    ? Math.ceil((dateFin - evolution.quantite[0].date) / (1000 * 60 * 60 * 24))
                    : 0;

                assert.equal(evolution.quantite.length, joursEntreDates);
            }
        });
    });



});