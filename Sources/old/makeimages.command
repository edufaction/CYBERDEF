#!/bin/bash 
set -x 
for file in `ls ./Tex/Pictures`; do 
    filename=${file%.pdf} 
    pdfcrop --margins 10 --clip "$filename.pdf" "$filename.pdf" 
    pdf2svg "$filename.pdf" "$filename.svg" 
done


