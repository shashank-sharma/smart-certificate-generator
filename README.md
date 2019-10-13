# Introduction
Certificates may seem a trivial matter but the automated generation of digital certificates is a blessing in disguise for event managers and developers alike. Inker is a smart certificate generator which provides its customers the ability to generate custom certificates based on the data the user provides. The user can either choose to upload his or her own template or choose from the ones we are offering. Once done, the user is required to input the data that he wants to include in the certificate, for example, some parameters may be Name, Organization and Date. When the user submits these data, the inker module which is integrated in our web app will smartly detect the positions in the certificate template that need to be replaced with the given data. We are using python libraries like nltk and spacy to detect tokens with their labels and identify required information from the user data. Then, we are removing text from the template ( the template can either be in pdf or image (jpg, png, etc)) format ). We will then generate the replacement text and replace it in approporiate positions in the generated certificate. The user can then download the his customized certificate. 

# Usage
Inker finds usage when creating and distributing of certificates in events becomes a hassle. Automation in generating certificates without much labor will help event managers to save time, monet and effort in generating certificates in bulk or individually as well. 

# Functionality
It prints the certificates with precision without altering the structure of images and other essential details.
Users just need to provide the required information to be displayed and the system will automatically print the information in its appropriate place. 

# Installation

Install Python and Flask without independent libraries and then use ReactJs installation and once done, run up both of the server to make it work. This product contains multiple individual models

# Working
The system is compatible with any format of template whether it could be pdf or image file. It analyzes and identifies the text over the given template and automaticallly fills the given information appropriately.

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

### Creating Template

<img src="https://imgur.com/QdIuVl8.jpg" />

### Replacing

<img src="https://i.stack.imgur.com/K53mD.png" />

### Webapp scanning and creating template

<img src="https://i.stack.imgur.com/gkCT5.png" />

### API Figuring out

<img src="https://i.stack.imgur.com/oYR2l.png" />
