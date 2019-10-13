# Introduction
Certificates may seem a trivial matter but the automated generation of digital certificates is a blessing in disguise for event managers and developers alike. Inker is a smart certificate generator which provides its customers the ability to generate custom certificates based on the data the user provides. The user can either choose to upload his or her own template or choose from the ones we are offering. Once done, the user is required to input the data that he wants to include in the certificate, for example, some parameters may be Name, Organization and Date. When the user submits these data, the inker module which is integrated in our web app will 
# Usage
You Can either select any template from given options or simply could upload your own template and it will print the certificate accordingly.

# Functionality
It print the certificates with precision without altering the structure of images and other essential details.
User just need to provide the required information to be diaplayed and the system will automatically print the information at its appropriate place. 

# Working
The system is compatible with any format of template whether it could be pdf or image file.It analyzes and identifies the text over the given template and automaticallly fills the given information appropriately.

# Architecture
The system comprises of opencv library with pytesseract module to analyze the template for text analysis and identification.it creates a rectangular box along every word to uniquely identify it which eases the removal and addition of user defined text over the certificate.

# TechnicalStack
Python,
Flask,
OpenCv,
Pytesseract,
Spacy,
NLTK

# Example

### Detecting

<img src="https://i.stack.imgur.com/FjZmd.png" />

### Replacing

<img src="https://i.stack.imgur.com/K53mD.png" />
