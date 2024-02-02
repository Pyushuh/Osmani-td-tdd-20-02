class Cube {
    constructor(length) {
        this.length = length;
    }
    
    getSideLength () {
        return this.length;
    }
    
    getSurfaceArea () {
        return (this.length * this.length) * 6;
    }
    
    getVolume () {
        return Math.pow(this.length,3);
    }
}


class Panier {
    constructor() {
        this.articles = [];
    }

    ajouterArticle(article) {
        this.articles.push(article);
        console.log(`${article.nom} a été ajouté au panier.`);
    }

    retirerArticle(article) {
        const index = this.articles.indexOf(article);
        if (index !== -1) {
            this.articles.splice(index, 1);
            console.log(`${article.nom} a été retiré du panier.`);
        } else {
            console.log(`${article.nom} n'est pas dans le panier.`);
        }
    }

    calculerMontantTotal() {
        let montantTotal = 0;
        for (const article of this.articles) {
            montantTotal += article.prix;
        }
        return montantTotal;
    }

    viderPanier() {
        this.articles = [];
        console.log("Le panier a été vidé.");
    }
}

class Article {
    constructor(nom, prix) {
        this.nom = nom;
        this.prix = prix;
    }
}

const panier = new Panier();

const article1 = new Article("Pommes", 2.5);
const article2 = new Article("Lait", 1.8);
const article3 = new Article("Pain", 1.2);

panier.ajouterArticle(article1);
panier.ajouterArticle(article2);
panier.ajouterArticle(article3);

console.log(`Montant total du panier : ${panier.calculerMontantTotal()} €`);

panier.retirerArticle(article2);

console.log(`Montant total du panier après retrait : ${panier.calculerMontantTotal()} €`);

panier.viderPanier();

console.log(`Montant total du panier après vidage : ${panier.calculerMontantTotal()} €`);

module.exports = {
    Cube:Cube,
    Panier:Panier
}