### Projet 1 - Vote App

Ce projet est une application de vote permettant aux administrateurs de gérer les votes et aux votants de participer.

## Prérequis

- Node.js
- npm

## Installation

1. Cloner le dépôt et placez vous dans le projet vote

```
git clone git@gitlab-etu.fil.univ-lille.fr:nomintuul.batbaatar.etu/jsfs-nomintuul.git

cd vote
```

2. Installer les dépendances

* Côté client :

```
cd client
npm install
```

* Côté serveur :

```
cd server
npm install
```

## Exécution

1. Constuire les bundles et alimenter `/server/public`

```
cd client
npm run build
```

2. Lancer le serveur

```
cd server
npm run start
```


## Connexion

Ouvrir un navigateur et accéder à :

- Page principale : http://localhost:3000
![principale](/images/home.png)
- Page administrateur : http://localhost:3000/admin-vote
![principale](/images/admin.png)
- Page votant : http://localhost:3000/votant
![principale](/images/voter.png)
- Page about: http://localhost:3000/about
![principale](/images/about.png)
