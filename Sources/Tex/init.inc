%-------------------------------------------------------------
%			 FR CYBERDEF SECOPS COURSE
% 					INIT Commands File
% 		Select BEAMER or Article/book Mode
% 			with sub extension .doc or .prz
%                           2020 eduf@ction
%-------------------------------------------------------------
\RequirePackage{xstring}


\IfSubStr*{\jobname}{.prz}{\newcommand{\PRZMODE}{YES}}{\newcommand{\DOCMODE}{YES}}
   
\IfSubStr*{\jobname}{.edt}{\newcommand{\EDTMODE}{YES}}{\newcommand{\NOMODE}{YES}}
