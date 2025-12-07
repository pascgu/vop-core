# Projet VoP - Visual Object Programming

## Description du Projet
Le projet VoP vise à créer un écosystème d'applications qui partagent une interface graphique commune basée sur ReactFlow. Les applications incluent :
- `vop-pico` : Une application Android pour envoyer des instructions à un microcontrôleur branché en USB.
- `vop-maui` : Une application MAUI pour le développement natif sur plusieurs plateformes (Windows, Linux, Android, iOS, macOS).
- `vop-vscode` : Une extension VS Code permettant de voir l'interface graphique d'un coté et le code de l'autre et d'interragir des 2 cotés.

L'architecture globale proposée est une architecture "Core Web + Native Wrappers". Le cœur de l'UI est développé en React (TypeScript) et chaque application est une coquille qui charge ce bundle React et injecte une API spécifique pour communiquer avec le matériel (USB, GPS, etc.).

## 1. Objectifs principaux
### Bidirectionnalité
- L’outil doit permettre de générer du code à partir d’un visuel **et** de générer un visuel à partir de code existant.

### Multi-langages
- Prise en charge initiale de **C#**, **Python**, **JavaScript** et **MicroPython** (pour les projets Raspberry Pi Pico dans l’association).
- Architecture extensible pour ajouter d’autres langages via des fichiers de description (CSV/JSON).

### Intégration IDE
- Fournir le projet comme **add-on pour VSCode** (priorité), puis pour **Visual Studio**. Un add-on par langage de programmation.

### Optimisation visuelle
- Afficher des programmes complexes de manière compacte (boîtes les plus petites possibles), avec un système de **sous-nœuds** (double-clic pour zoomer).

### Développement Android
- Permettre de programmer un Raspberry Pi Pico depuis un téléphone Android (via USB OTG ou WiFi) et de le piloter comme une télécommande (boutons, sliders, etc.).

### Uniformisation UI
- Centraliser le développement de l'interface graphique (Frontend) pour qu'elle soit partageable entre l'extension VSCode, l'application Android et la version Desktop.

## 2. Fonctionnalités clés
### Description des fonctions
- Chaque fonction du langage ou framework est décrite dans un **JSON** (entrées/sorties, types, icône, texte). Ces descriptions sont regroupées dans un **CSV** (1 colonne = 1 JSON par fonction).

### Génération automatique
- Pour les langages comme **C#** et **Python**, utiliser la **réflexion** pour générer automatiquement le CSV de fonctions. Pour **MicroPython**, prévoir une description manuelle ou semi-automatisée (pas de réflexion native). **Alternative** : Utiliser le **Linter de VSCode** pour analyser le code existant et extraire les informations nécessaires (entrées/sorties, types), évitant ainsi de recoder des parseurs.

### Exécution parallèle
- Si deux chemins peuvent s’exécuter en parallèle, les lancer en **multithread** pour exploiter les capacités du langage. Pour **MicroPython**, permettre l’utilisation explicite du deuxième cœur (pas de multithreading automatique).

### Refactoring visuel
- Regrouper les bouts de code similaires pour minimiser le nombre de nœuds à haut niveau. Chaque fonction devient un sous-nœud.

### UI intégrée
- Chaque nœud peut avoir sa propre **UI** (comme LabView), avec des widgets personnalisables. À la fin, on obtient un formulaire avec tous les widgets.

### Visualisation des données
- Afficher les **données circulant** entre les nœuds (points mobiles sur les liens). Ajouter un **mode ralenti** pour le debug.

### Constantes visibles
- Afficher les constantes utilisées en entrée des fonctions (comme LabView), mais permettre de les masquer si non utiles.

### Support Android
- Développer une application Android (MAUI ou Flutter) pour programmer et piloter les Pico via USB OTG ou WiFi (MQTT).

### Connexions automatiques
- Quand un nœud est approché d’un autre, proposer automatiquement les connexions entre les ports compatibles (sorties → entrées). Deux options : connexion automatique si les noms des ports correspondent, ou affichage d’un formulaire pour laisser l’utilisateur choisir parmi les connexions possibles.

### Gestion des instructions inconnues
- Quand VoP lit du code et génère un workflow, les instructions non reconnues (mots-clés, syntaxe, fonctions ou librairies manquantes) doivent être représentées par un **nœud dédié en gris/rouge** dans le workflow. Ces nœuds sont **ignorés lors de l’exécution**, mais leur code est **conservé tel quel** dans le fichier généré pour garantir que le code source reste fonctionnel.

## 3. Choix techniques
| Choix | Justification |
|-------|---------------|
| **Fichiers CSV/JSON** | Centraliser la description des fonctions pour faciliter l’ajout de nouveaux langages. |
| **Réflexion (C#/Python)** | Automatiser la génération des descriptions de fonctions pour ces langages. |
| **Linter de VSCode** | Utiliser le Linter intégré de VSCode pour analyser le code et extraire les informations nécessaires (entrées/sorties, types), évitant de recoder des parseurs. |
| **Multithreading** | Exploiter le parallélisme natif des langages pour les chemins indépendants. Pour **MicroPython**, permettre une gestion explicite du deuxième cœur. |
| **Add-on VSCode** | Priorité à VSCode pour sa popularité et sa modularité. Visual Studio viendra ensuite. |
| **Widgets et UI** | Inspiré de LabView, mais avec une approche modulaire et extensible. |
| **DrawnUI (SkiaSharp)** | *Option Native (Historique)* : Bibliothèque open-source (MIT) pour créer des interfaces vectorielles et interactives en C#. Idéale pour les diagrammes de flux et les animations temps réel (60 FPS). |
| **LiveCharts2** | Bibliothèque open-source (MIT) pour les graphiques dynamiques, compatible avec SkiaSharp pour des performances optimales. |
| **Flutter** | Framework open-source (Google) pour des interfaces fluides (60-120 FPS) et légères (~50-100 Mo RAM). Idéal pour les animations complexes et le développement mobile cross-platform. |
| **MAUI Pur** | Intégration native en C# sans WebView. Meilleure performance (~60 FPS) et mémoire (~50-80 Mo). |
| **MAUI Hybride (Blazor)** | Utilise un WebView pour embarquer des composants Blazor. Surcharge mémoire (~100-150 Mo) et performances limitées (~30-60 FPS). |
| **Technologies Web (React/TS)** | Permet de créer un Frontend unique compatible VSCode (Webview) et Android (via Blazor Hybrid). |
| **Parseur tolérant** | Utiliser un parseur tolérant (ex : Roslyn pour C#, AST pour Python) pour identifier les instructions inconnues sans interrompre l’analyse. |
| **Version web (Blazor WASM)** | Permettre une utilisation de VoP sans installation, idéale pour des modifications collaboratives ou rapides. Ignorée dans un second temps au profit de HypbridWebView |
| **Version MAUI (HypbridWebView)** | Choisie pour sa légèreté et sa performance par rapport à MAUI BlazorWebView. Permet une communication directe entre le code C# et JavaScript sans la surcharge du runtime Blazor et un accès natif aux fonctionnalités matérielles. Ajoutée avec .Net 9 en novembre 2025. |

### Architecture

Pour l'UI, ont été envisagé:
- **MAUI+DrawnUI (C# natif)** : ne permet pas de réutiliser l'UI faite en ReactFlow
- **MAUI hybrid+Blazor WebView** : permet de réutiliser l'UI faite en ReactFlow mais est plus lourd.
- **MAUI+HybridWebView** : retenu. Permet de réutiliser l'UI faite en ReactFlow et est plus léger, permet également d'accéder aux fonctionnalités matérielles.

1.  **VoP-core** : Le repos central
  - **ui/: Frontend Commun (Web)** : L'éditeur visuel est codé en **TypeScript** (React Flow). Il génère un JSON. C'est un projet React (TypeScript) pur. Il contient ReactFlow, la logique des diagrammes, et l'état de l'interface. Il produit un "build" statique (index.html, bundle.js, style.css).
  - proj/: des fichiers de description du projet et de suivi des taches (ex: `proj.json`, `tasks.json`).
  - d'éventuels autres outils communs aux différentes applications.
2.  **Architecture "Coques"** : Le frontend Web de VoP-core est encapsulé dans différents conteneurs natifs :
  - **VoP-vscode: extension VSCode** : via Webview.
  - **VoP-pico (Android, Windows, Linux)** : via **MAUI + HypbridWebView**.
  - **VoP-maui (Windows, Linux, Mac, Android, iOS)** : via **MAUI + HypbridWebView**.

## 4. Pistes de réflexion / À affiner
| Idée | Statut | Commentaire |
|------|--------|-------------|
| **UI par nœud** | À explorer | Comment standardiser les widgets pour qu’ils soient réutilisables et cohérents ? |
| **Mode ralenti pour le debug** | À implémenter | Utile pour visualiser les flux de données complexes. |
| **Masquage des constantes** | À implémenter | Option pour cacher/montrer les constantes selon leur utilité. |
| **Génération de formulaires** | À explorer | Comment agréger les widgets de chaque nœud en un formulaire final ? |
| **Intégration de DrawnUI** | *En pause* | Remplacé prioritairement par un prototypage Web (React Flow) pour valider l'intégration VSCode. DrawnUI reste une option si la perf Web est insuffisante sur mobile. |
| **LiveCharts2** | À implémenter | Intégrer les graphiques temps réel pour la visualisation des données. |
| **Connexions automatiques** | À explorer | Gain de temps, expérience intuitive. |
| **Gestion des instructions inconnues** | À explorer | Nœuds gris/rouges ignorés à l'exécution mais conservés dans le code. |
| ~~**Add-on pour tous les IDE**~~ | **Non retenu** | Se concentrer sur VSCode et Visual Studio en priorité, puis étendre si demande. |
| **Flutter** | non retenu | complexité du pont entre Dart et JavaScript et moins bonne intégration avec ReactFlow. |
| **React Native** | non retenu | incompatible avec ReactFlow qui nécessite le DOM Web standard. |
| **Capacitor/Ionic** | non retenu | complexité du pont entre JavaScript et les APIs natives. |
| **HypbridWebView** | À implémenter | complexité du pont entre JavaScript et les APIs natives. |

## 5. Analyse des solutions existantes
### **LabVIEW**
- **Points forts** : Visualisation temps réel des flux de données, gestion avancée des interfaces utilisateur, bidirectionnalité code/visuel, support multi-langages (C, Python).
- **À reprendre** : Visualisation dynamique des données, gestion des interfaces modulaires, intégration avec IDE (Visual Studio, VSCode).
- **À éviter** : Complexité pour les débutants, coût élevé.

### **n8n**
- **Points forts** : Automatisation visuelle, intégration IA, gestion multi-langages (JavaScript, Python), bidirectionnalité.
- **À reprendre** : Génération de code bidirectionnelle, intégration avec IDE, gestion des API et des services externes. **Inspiration majeure pour l'UI Web (Rete.js).**
- **À éviter** : Exécution séquentielle des nœuds, configuration complexe.

### **Node-RED**
- **Points forts** : Open-source, interface intuitive, exécution parallèle, large bibliothèque de nœuds.
- **À reprendre** : Flexibilité, gestion des flux de travail, intégration avec des services externes.
- **À éviter** : Limité en gestion multi-langages, moins adapté aux non-développeurs.

## 6. Recommandations pour VoP
### **Fonctionnalités à reprendre**
- **Visualisation temps réel des flux de données** (inspiré de LabView).
- **Génération automatique de code bidirectionnelle** (LabVIEW, n8n).
- **Support multi-langages et extensibilité** (LabVIEW, n8n).
- **Gestion avancée des interfaces utilisateur** (LabVIEW).
- **Intégration avec IDE modernes** (LabVIEW, n8n).
- **Mode ralenti pour le debug** (inspiré de LabView).
- **Masquage des constantes** (LabView).
- **Utilisation du Linter VSCode** pour analyser le code et extraire les informations nécessaires (entrées/sorties, types).
- **Utilisation de DrawnUI** (Réserve : uniquement si l'approche Web échoue en performance).
- **Architecture Web Unifiée (React Flow/Rete.js)** : Pour partager le frontend entre VSCode et Android.
- **LiveCharts2** pour les visualisations dynamiques.
- **Connexions automatiques entre nœuds** pour simplifier la création de workflows.
- **Gestion des instructions inconnues** pour permettre l’édition de projets partiellement incompris.
- **version MAUI+HybridWebView+ReactFlow** pour la gestion multiplateforme et l'accès aux fonctionnalités matérielles.

### **Pièges à éviter**
- Complexité d’utilisation pour les débutants (LabVIEW).
- Limites en multithreading (n8n).
- Manque de support multi-langages (Node-RED).
- Configuration initiale complexe (n8n).

### **Opportunités d’innovation**
- Combinaison de bidirectionnalité, multithreading natif et intégration IDE moderne.
- Intégration native d’intelligence artificielle pour la génération et l’optimisation du code (n8n).
- Gestion avancée des constantes et des dépendances.
- Support pour la programmation visuelle éducative (Scratch, Blockly).
- **Utilisation des outils existants de VSCode** (comme le Linter) pour simplifier l’analyse du code.
- **Développement Android** pour programmer et piloter les Pico en mobilité.
- **Connexions automatiques entre nœuds** pour accélérer la création de workflows.
- **Gestion des instructions inconnues** pour une utilisation flexible de VoP.
- **Version web** pour une accessibilité accrue.

## 7. Références
- [Analyse comparative des solutions existantes (PDF)](https://drive.picibi.fr/f/111913) (disponible dans `/_Perso/VoP`)
- [VoP projs - compare MAUI vs MAUI hybrid vs Flutter vs ReactNative + compare MAUI HybridWebView vs MAUI Hybrid BlazorWebView](https://drive.picibi.fr/f/112458) (disponible dans `/_Perso/VoP`)
