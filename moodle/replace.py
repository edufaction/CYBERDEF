#!/usr/bin/env python
import os, sys
import fileinput

inputname = os.path.splitext(sys.argv[1])[0]
output = open(inputname + ".r.tex", 'w')

for line in fileinput.input(sys.argv[1]):
    line = line.replace("’","'")   
    line = line.replace("é","\\'e")    
    line = line.replace("É","\\'E")
    line = line.replace("è","\`e")		
    line = line.replace("à","\`a")
    line = line.replace("È","\`E")
    line = line.replace("À","\`A")
    line = line.replace("ê","\^e")	
    line = line.replace("â","\^a")	
    line = line.replace("î","\^\i") 		
    line = line.replace("ô","\^o")		
    line = line.replace("û","\^u")
    line = line.replace("Ê","\^E")		
    line = line.replace("Â","\^A")		
    line = line.replace("Î","\^I")		
    line = line.replace("Ô","\^O")		
    line = line.replace("Û","\^U")
    line = line.replace('ë','\"e')
    line = line.replace('ï','\"\i')
    line = line.replace('ü','\"u')
    line = line.replace('Ë','\"E')
    line = line.replace('Ï','\"I')
    line = line.replace('Ü','\"U')
    output.write(line)

output.close()

    


