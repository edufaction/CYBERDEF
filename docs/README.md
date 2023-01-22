![This is an image](Sources/Tex/Pictures/img-risk-prison.png)

## Bienvenue sur ce site (COURS CYBERDEF101)

CYBERDEF101 constitue, les ressources construites pour le cours d'introduction à la cybersécurité SEC 101 du Cnam, délivré sur le CNAM Bretagne est réalisé pour et avec les étudiants du CNAM SEC 101.

## Intro Cyberdef

Les documents réalisés pour CYBERDEF101 sont rédigés en LATEX, tant pour les présentations que pour les notes de cours.
* Ces notes ne représentent qu'une partie du Cours, et ne serait se substituer aux éléments de cours délivrés sur le site d'enseignement du CNAM pour SEC101 (Cnam Bretagne)

## Documents sources LATEX
 > Les sources des éléments de cours sont en Latex. Plusieurs type de documents sont publiés à partir de ces source : BOOK (*.book.tex), NOTES (*.DOC.pdf et *.PRZ.pdf), et WEB (*.web.tex), COURSES (*.course.tex)

### Organisation des répertoires 
* **Builder** : répertoires des pdf produits et du site static Html (Book)
* **Ressources** : sources des images et différents documents sources pour production Glossaire, Accronynes, Gestion de projet ...
* **Sources**  : sources Latex.
* **Docs** : documentation du projet

### type de documents 

* BOOK (modèle BookModel, documentclass (book) : compliation de tous les modules du cours, en 1 seul document
* COURSES (Modèle CourseModel), documentclass(book)
* NOTES (Modèle NotesModel), documentclass(Article) avec Beamer(PRZ), en Texte (DOC)
* WEB (Modèle WebModel), documentclass (book) - compile PDF, mais destiné à [Tex4ht](https://tug.org/tex4ht/) pour la publication en Html.

Tous les documents "Jobname" sont dans la racine **sources**, les sources Latex dans **/Tex**.


### Particularité fichiers  ".tex" racine 

Les projets **NOTES** constituant les différents documents PDF produits, sont simplement des **\input{}** de fichiers, en fonction de l'extension secondaire, la cible est différente, les noms des fichiers produits sont plus facilement manipulables (effacés, renomés), car ne contiennent  peu de chose.

 Fichier **Exemple**
```latex
% file: Cours1-intro.prz.tex
\input{Tex/init.inc}
\input{Tex/Build-Notes/intro.notes.tex}
```
 Fichier **init.inc**
```latex
\RequirePackage{xstring}
\IfSubStr*{\jobname}{.prz}
    {\newcommand{\PRZMODE}{YES}}
    {\newcommand{\DOCMODE}{YES}}
```

### Chaine de production 

* PDFtex (MacTex)
* Tex4ht
* Ghostscript
* imagemagick
* python