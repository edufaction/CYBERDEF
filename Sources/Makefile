
# -----------------------------------------------
# ===============================================
# 					CYBERDEF101
# 				Build All from sources
# Needs :
#	imagemagick
#	pdf2svg (Used by Tex4ht -> Html & Ebook)
#	ghoscript
#	TexLive
#	Pandoc (Md to Latex & Reveal/js)
# ===============================================
# -----------------------------------------------
MAKEFLAGS += --no-builtin-rules
.SUFFIXES:
SUFFIXES:= 
%.tex:
%.acr:
%.eps:

IMG_DIRS := ./Tex/Pictures
TEX_DIRS := ./
COMPILE_DIR := ./out
INSTALL_DIR := ../Builder
MD_DIRS := ./Markdown
TEXFILES:= *
#WEBF := CYBERDEF101-3-SecOps.course

# TEX COMPILE Var  ======================================
# Warning Only One for Makefile
BookFile := $(shell find $(TEX_DIRS) -name '*.book.tex') # (VAR) Book MainPDF
WebFile := $(shell find $(TEX_DIRS) -name '*.web.tex') # (VAR) WEB PDF & HTML
# All PDF produced by this chain
PrzFiles := $(shell find $(TEX_DIRS) -name '*.prz.tex') # Beamer Files PDF (*.PRZ.PDF)
DocFiles := $(shell find $(TEX_DIRS) -name '*.doc.tex') # Article Files PDF (*.DOC.PDF)
CoursesFiles :=$(shell find $(TEX_DIRS) -name '*.course.tex') # Book PDF

JSF := $(subst $(MD_DIRS)/Files,$(MD_DIRS)/out/RJS,$(shell find $(MD_DIRS)/Files -name '*.rjs.md'))
JSFiles :=$(subst .rjs.md,.html,$(JSF))


# Pictures COMPILE Var ====================================
# Images Sources in PDF, manually exported form Powerpoint
IMGF := $(subst .pdf,,$(shell find $(IMG_DIRS) -name '*.pdf'))
IMG_SVG := $(IMGF:%=%.svg)
IMG_PNG := $(IMGF:%=%.png)
IMG_EPS := $(IMGF:%=%.eps)

# RULES ====================================================

.PHONY: help

help: # Aide sur les commands disponibles
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

# ----------------------------------------------------------
#  < all: > RULE
# ----------------------------------------------------------
all: pictures # Construction de toutes les dépendances (Pictures)


# **********************************************************
# COMPILATION COURS ========================================

Allcnam: pictures $(WebFile) # Construction des fichiers TEX de la racine "Sources"
	latexmk -output-directory=$(COMPILE_DIR)  $(WEBF).tex 

# **********************************************************
# MARKDOWN RULES ===========================================
# ----------------------------------------------------------
#  < mdtex: > RULE
# ----------------------------------------------------------
mdtex: $(MDTEXF) # Construction des fichiers TEX a partir de MD (Test only)
	pandoc --template=Markdown/template/md2tex.template.tex -s Chapters/mdsec-intro-infosec.md -o Chapters/mdsec-intro.infosec.tex
# ----------------------------------------------------------
#  < mdreveal: > RULE
# ----------------------------------------------------------

$(MD_DIRS)/out/RJS/%.html: $(MD_DIRS)/Files/%.rjs.md
#	pandoc --standalone -t revealjs -s  $<  -o $@ -V revealjs-url=reveal.js  --include-in-header=$(MD_DIRS)/template/revealjsmd.css -V theme=blood 
	pandoc --standalone -t revealjs -s  $<  -o $@ -V revealjs-url=reveal.js  --template=$(MD_DIRS)/Templates/RJS/revealjs.template.html --include-in-header=$(MD_DIRS)/Templates/RJS/revealjsmd.css -V theme=orange 


#	pandoc --standalone -t html5 -s  $<  -o $@  --template=$(MD_DIRS)/template/revealjs.template.html

#	pandoc -t html5 --template=template-revealjs.html \
	--standalone --section-divs \
  --variable theme="beige" \
  --variable transition="linear" \
  slides.md -o slides.html


#	pandoc -t revealjs -s  $<  -o $@ -V revealjs-url=https://unpkg.com/reveal.js/ --include-in-header=$(MD_DIRS)/template/revealjsmd.css -V theme=blood
#--metadata title=Cyberdef101

mdreveal:  $(JSFiles) $(MD_DIRS)/Templates/RJS/revealjs.template.html # Construction des fichiers REVEAL JS a partir de MD (tous les md dans Markdown/Chapters)

#movebuilder: #Installation BUILDER pour publication GITHUB
#	cp -f ./*.pdf ./../Builder
#	cp -f out/*.pdf ./../Builder

../Builder/%.pdf: out/%.pdf #Installation BUILDER pour publication GITHUB	
	cp -f $< $@

# Clear *.html produced
mdrevealall :  cleanmd mdreveal
# ----------------------------------------------------------
#  < wedpdf: > RULE
# ----------------------------------------------------------
# use latexmkrc (implicit)
webpdf: pictures $(WebFile) # Construction des fichiers TEX de la racine "Sources"
	latexmk -output-directory=$(COMPILE_DIR)  $(TEXFILES).tex 

out/%.pdf:  # Construction des fichiers TEX de la racine "Sources"
	latexmk -pdf -output-directory=$(COMPILE_DIR)  $(TEXFILES).tex 

# -interaction : batchmode nonstopmode
#pdflatex="-interaction=batchmode -output-directory=$(COMPILE_DIR)"
#-pdf 

# Web (Tex4ht) --------------------------------------
web: pictures # Construction des images pour TEX to PDF
	make4ht -c edx.cfg -f html5 -d $(COMPILE_DIR)/html $(WEBF).tex "3,frames-fn";open $(COMPILE_DIR)/html/$(WEBF).html
#-c edx.cfg 

test: pictures
	make4ht -c edx.cfg -f html5 -d $(COMPILE_DIR)/html minitest.tex "3,frames-fn"

# PICTURES -----------------------------------------------
pictures: $(IMG_EPS) $(IMG_SVG) $(IMG_PNG) 

# (IMG_PNG) rule
$(IMG_DIRS)/%.png: $(IMG_DIRS)/%.pdf
	convert -density 96 $< $@
	ebb -x $<
# (IMG_EPS) rule
$(IMG_DIRS)/%.eps: $(IMG_DIRS)/%.pdf
	pdf2ps $< $@
# (IMG_SVG) rule
$(IMG_DIRS)/%.svg: $(IMG_DIRS)/%.pdf
	pdf2svg $< $@



cleanout: # Purge de tous les fichiers OUT
	rm -f $(COMPILE_DIR)/*.aux
	rm -f $(COMPILE_DIR)/*.toc

clean: # Purge de tous les fichiers auxilaires Racine
	latexmk -c
	rm -f *.xml
	rm -f *.idx
	rm -f *.ilg
	rm -f *.ind
	rm -f *.bbl
	rm -f *.snm
	rm -f *.ptc 
	rm -f *.nav
	rm -f *.toc
	rm -f *.xref
	rm -f *.tmp
	rm -f *.ps
	rm -f *.pdf
	rm -f *.out
	rm -f *.dvi
	rm -f *.bcf
	rm -f *.4ct
	rm -f *.4tc 
	rm -f *.aux
	rm -f *.bbl
	rm -f *.nav
	rm -f *.snm
	rm -f *.out
	rm -f *.toc
	rm -f *.ptc
	rm -f *.xml
	rm -f *.log
	rm -f *.idv
	rm -f *.lg
	rm -f *.html
	rm -f *.svg

cleanmd: # Purge de tous les fichiers auxiliaires (HTML,TEX) dans /MarkDown
	rm -f $(MD_DIRS)/out/RJS/*.html
	rm -f $(MD_DIRS)/out/LTX/*.tex

cleanimg: # Purge de tous les fichiers auxiliaires dans /MarkDown
	rm -f $(IMG_DIRS)/*.png
	rm -f $(IMG_DIRS)/*.svg
	rm -f $(IMG_DIRS)/*.eps
	rm -f $(IMG_DIRS)/*.xbb 
	rm -f $(IMG_DIRS)/*.nav

install: # Installation dans Builder (PDF TEX et HTML TEX)
	cp $(COMPILE_DIR)/*.pdf $(INSTALL_DIR)
