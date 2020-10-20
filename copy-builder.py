import os, shutil, glob

#Source file
sourcefile = '/Users/ericdupuis/Documents/GitHub/CYBERDEF/'

# for loop then I split the names of the image then making new folder
for file_path in glob.glob(os.path.join(sourcefile, '*.pdf')):
#new_dir = file_path.rsplit('.', 1)[0]
    new_dir = 'Builder/'

    # If folder does not exist try making new one
#  try:
#     os.mkdir(os.path.join(sourcefile, new_dir))
#  # except error then pass
 #   except WindowsError:
#      pass
    # Move the images from file to new folder based on image name
    shutil.move(file_path, os.path.join(new_dir, os.path.basename(file_path)))
    
