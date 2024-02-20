class Cube {
    constructor(length) {
        this.length = length;
    }

    getSideLength() {
        return this.length;
    }

    getSurfaceArea() {
        return (this.length * this.length) * 6;
    }

    getVolume() {
        return Math.pow(this.length, 3);
    }
}

class Stock {
    constructor() {
        this.articles = [];
    }

    ajouterArticle(article, quantite) {
        if (quantite >= 0) {
            article.stockQuantite = quantite;
            article.dateAjout = new Date();
            this.articles.push(article);
            console.log(`${quantite} exemplaire(s) de ${article.nom} ont été ajouté(s) au stock.`);
        } else {
            console.log("La quantité d'article ne peut pas être négative.");
        }
    }

    retirerArticle(article) {
        const index = this.articles.findIndex(a => a === article);

        if (index !== -1) {
            this.articles.splice(index, 1);
            console.log(`${article.nom} a été complètement retiré du stock.`);
        } else {
            console.log(`${article.nom} n'est pas présent dans le stock.`);
        }
    }


    retirerStockArticle(article, quantite) {
        const stockArticle = this.articles.find(a => a === article);

        if (stockArticle) {
            if (quantite > 0) {
                if (stockArticle.stockQuantite >= quantite) {
                    stockArticle.stockQuantite -= quantite;
                    console.log(`${quantite} exemplaire(s) de ${article.nom} ont été retiré(s) du stock.`);
                } else {
                    stockArticle.stockQuantite -= stockArticle.stockQuantite;
                    console.log(`La quantité de ${article.nom} dans le stock est insuffisante. On a retiré le maximum.`);
                }
            } else {
                console.log("La quantité à retirer doit être supérieure à zéro.");
            }
        } else {
            console.log(`${article.nom} n'est pas présent dans le stock.`);
        }
    }


    getArticlesDisponibles() {
        return this.articles.filter(article => article.stockQuantite > 0);
    }

    getQuantiteArticle(article) {
        const stockArticle = this.articles.find(a => a === article);
        return stockArticle ? stockArticle.stockQuantite : 0;
    }

    getArticlesPerimes() {
        const dateActuelle = new Date();
        return this.articles.filter(article => {
            return article.datePeremption && article.datePeremption < dateActuelle;
        });
    }

    evolutionsStock(dateDebut, dateFin) {
        if (dateDebut < dateFin) {
            const evolutions = this.articles.map(article => {
                const evolution = {
                    nom: article.nom,
                    quantite: [],
                };

                let currentQuantite = article.stockQuantite;
                let currentDate = article.dateAjout;

                while (currentDate <= dateFin) {
                    if (currentDate >= dateDebut) {
                        evolution.quantite.push({
                            date: new Date(currentDate),
                            quantite: currentQuantite,
                        });
                    }

                    currentDate.setDate(currentDate.getDate() + 1);
                }

                return evolution;
            });

            return evolutions;
        } else {
            console.log("La première date doit être inférieure à la seconde date pour comparer l'évolution du stock.");
            return [];
        }
    }
}

class Panier {
    constructor() {
        this.articles = [];
        this.remiseAppliquee = false;
    }

    ajouterArticle(article) {
        if (article.prix >= 0) {
            this.articles.push(article);
            console.log(`${article.nom} a été ajouté au panier.`);
        } else {
            console.log(`Impossible d'ajouter ${article.nom} au panier car le prix est négatif.`);
        }
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

        if (this.remiseAppliquee) {
            for (const article of this.articles) {
                montantTotal += article.prixReduit;
            }
        } else {
            for (const article of this.articles) {
                montantTotal += article.prix;
            }
        }

        return montantTotal;
    }

    appliquerRemise(pourcentage) {
        if (!this.remiseAppliquee && pourcentage > 0 && pourcentage < 100) {
            for (const article of this.articles) {
                const prixReduit = article.prix * (1 - pourcentage / 100);
                if (prixReduit < article.prix && prixReduit > 0) {
                    article.prixReduit = prixReduit;
                } else {
                    console.log(`La remise ne peut pas être appliquée sur l'article ${article.nom}.`);
                }
            }

            this.remiseAppliquee = true;
            console.log(`Remise de ${pourcentage}% appliquée sur le panier.`);
        } else {
            console.log("La remise ne peut pas être appliquée.");
        }
    }

    viderPanier() {
        this.articles = [];
        this.remiseAppliquee = false;
        console.log("Le panier a été vidé.");
    }
}

class Article {
    constructor(nom, prix) {
        this.nom = nom;
        this.prix = prix;
        this.prixReduit = prix;
        this.stockQuantite = 0;
        this.dateAjout = null;
    }
}

// Création d'un panier, et utilisation des fonctions associées
const panier = new Panier();

const article1 = new Article("Pommes", 2.5);
const article2 = new Article("Lait", 1.8);
const article3 = new Article("Pain", 1.2);

panier.ajouterArticle(article1);
panier.ajouterArticle(article2);
panier.ajouterArticle(article3);

console.log(`Montant total du panier (sans remise) : ${panier.calculerMontantTotal()} €`);

panier.appliquerRemise(10); // Appliquer une remise de 10%

console.log(`Montant total du panier (avec remise) : ${panier.calculerMontantTotal()} €`);

panier.retirerArticle(article2);

console.log(`Montant total du panier après retrait : ${panier.calculerMontantTotal()} €`);

panier.viderPanier();

console.log(`Montant total du panier après vidage : ${panier.calculerMontantTotal()} €`);

//Création d'un stock et utilisation des fonctions associées
const stock = new Stock();

const articleStock1 = new Article("Pommes");
const articleStock2 = new Article("Lait");
const articleStock3 = new Article("Pain");

stock.ajouterArticle(articleStock1, 50);
stock.ajouterArticle(articleStock2, 30);
stock.ajouterArticle(articleStock3, 20);

console.log("Articles disponibles :");
console.log(stock.getArticlesDisponibles());

console.log("Quantité de Pommes : " + stock.getQuantiteArticle(articleStock1));

const dateDebut = new Date("2024-01-01");
const dateFin = new Date("2024-01-10");

console.log(`Évolution du stock entre ${dateDebut.toDateString()} et ${dateFin.toDateString()} :`);
console.log(stock.evolutionsStock(dateDebut, dateFin));


module.exports = {
    Cube: Cube,
    Panier: Panier,
    Article: Article,
    Stock: Stock
}