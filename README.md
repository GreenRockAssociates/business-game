# Green Rock Associates business game

## À propos
L'objectif de ce projet est de réaliser un business game à l'intention d'étudiants en école de commerce ou autre afin de les initier au monde du trading. Il se présente sous la forme d'une bourse où il est possible d'acheter et de vendre des actions. Les joueurs concourent ainsi sur une durée déterminée afin de voir qui parviendra à faire les meilleurs bénéfices.

---

## Installation
### En production

### En développement
##### 1. Installation des dépendances
- Se rendre dans le dossier-projet de chaque service :
    - /Engine/AssetHealth
    - /Engine/DataSource
    - /Engine/GameOrchestrator
    - /Engine/MarketAnalysis
    - /Engine/MarketAutomationEnactment
    - /Engine/MarketSimulationCadencer
    - /Engine/MarketSimulationWorker
    - /Engine/PlayerState
    - /Gateway/Authentication
    - /Gateway/Command
    - /Gateway/Launcher
    - /Gateway/Query
    - /Gateway/RealTimeMarketUpdate
- Dans chaque dossier, effectuer la commande `npm install`

##### 2. Préparer les environnements
Dans chacun des dossier, créer un fichier .env et le remplir avec les bonnes données.

Les différents templates de .env sont disponibles sur discord dans le channel #environments ou au bas de ce readme.

##### 3. Lancer les logiciels tiers
- Se placer à la racine du repo
- Exécuter la commande `docker compose up -d`

##### 4. Lancer les services
- Se placer dans le dossier de chaque service que vous souhaitez lancer
- Exécuter la commande `npm run serve` pour chacun d'eux (dans un terminal différent car la commande occupe le terminal actuel jusqu'à l'arrêt du service)

Les services lancés ainsi sont relancés automatiquement lorsque leur code source est modifié (mais pas les variables d'environnement)

**Simplifier le lancement des services**
Afin de lancer plus facilement un service en appuyant sur un seul bouton, il est possible de définir des configurations dans IntelliJ

Pour cela, cliquez sur "run" dans la barre de menu de la fenêtre puis "Edit configurations".

Dans la popup qui s'affiche, cliquer sur le bouton "+" en haut à gauche, puis dans la liste choisissez "npm".

Remplissez ensuite les champs dans la partie droite de la fenêtre comme suit :
- `Name` : donnez un nom descriptif à la configuration. Par exemple "serve auth"
- `package.json` : Le chemin du vers le package.json pour ce projet (ex: `~/IdeaProjects/business-game/Gateway/Authentication/package.json`)
- `Command` : `run`
- `Scripts` : `serve`

Vous pourrez ensuite lancer la configuration en la sélectionnant dans le menu déroulant en haut à droite du logiciel, puis sur le bouton "play" vert juste à droite de la liste.

## Tests
### Exécuter les tests
- Se placer dans le dossier de chaque service que vous souhaitez tester
- Exécuter la commande `npm run test`

Si vous souhaitez lancer un test spécifique, vous pouvez également - dans IntelliJ - ouvrir le fichier *.spec.ts qui le contient, puis appuyer sur le petit bouton vert (ou rouge si le test a échoué) dans la marge

### Simplifier la gestion des tests
Afin de lancer plus facilement l'ensemble des tests d'un service en appuyant sur un seul bouton, il est possible de définir des configurations dans IntelliJ

Pour cela, cliquez sur "run" dans la barre de menu de la fenêtre puis "Edit configurations".

Dans la popup qui s'affiche, cliquer sur le bouton "+" en haut à gauche, puis dans la liste choisissez "Jest".

Remplissez ensuite les champs dans la partie droite de la fenêtre comme suit :
- `Name` : donnez un nom descriptif à la configuration. Par exemple "Authentification - All tests"
- `Jest package` : cette valeur devrait se définir automatiquement en changeant le champ `Working directory`. Autrement, il s'agit du chemin vers le dossier jest dans node_modules (ex: `~/IdeaProjects/business-game/Gateway/Launcher/node_modules/jest`)
- `Working directory` : Le chemin du dossier contenant le package.json pour ce projet (ex: `~/IdeaProjects/business-game/Gateway/Launcher`)
- `Jest options` : Spécifiez l'option `--runInBand` afin de désactiver la parallélisation des tests, car cela pose problème pour les tests utilisant la base de données

Vous pourrez ensuite lancer la configuration en la sélectionnant dans le menu déroulant en haut à droite du logiciel, puis sur le bouton "play" vert juste à droite de la liste.

## Débogage
### Base de données
IntelliJ est capable de visualiser les bases de données dans les containers docker. Pour cela, cliquez sur l'onglet "Database" à droite de la fenêtre (le texte est vertical), puis sur l'icône "+" dans le panneau qui s'affiche.

Cliquez ensuite sur "Data source" > "PostgreSQL"

Dans la popup qui s'affiche, remplissez les champs :
- `Name` : Le nom de la source affiché dans l'interface
- `Host` : `localhost`
- `Port` : Le port sur lequel tourne le container. Se référer au tableau d'utilisation des ports
- `Authentication` : `User & Password`
- `User` : `postgres`
- `Password` : `postgres`
- `Database` : Le nom de la BDD pour le service. C'est le même qu'après le dernier slash dans l'entrée `TYPEORM_URL` du .env
  Cliquez ensuite sur "Test connection" en bas. Si cela fonctionne, continuez
  Toujours dans la popup, cliquez sur l'onglet "Schemas". Puis cochez le nom de la bdd que vous avez entré dans le champ `Database` (ex: iam pour le service d'authentification). Lorsque vous déroulez cette entrée, il est important que l'entrée "public" soit cochée.
  Cliquez ensuite sur "ok" en bas à droite de la popup.

La datasource apparait désormais dans le panneau "Database". Déroulez les entrées successives jusqu'à atteindre les tables (ex: Auth service > iam > public > tables)

Vous pouvez ensuite double cliquer sur une table pour l'ouvrir et la parcourir dans IntelliJ

### API
Utilisez un logiciel comme Insomnia ou Postman pour exécuter des requêtes HTTP arbitraire auprès du serveur

Pensez bien à envoyer le cookie de session. Si vous testez des services de la gateway, pensez aussi au cookie csrf (nommé `XSRF-TOKEN`), ainsi qu'à recopier ce cookie dans le header `X-XSRF-TOKEN` pour que votre requête soit acceptée (les deux logiciels ont des moyens de faire ça automatiquement, renseignez vous).