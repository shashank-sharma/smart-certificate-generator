import nltk
import re
from nameparser.parser import HumanName
import spacy

nlp = spacy.load("en_core_web_sm")

def get_human_names(text):
    tokens = nltk.tokenize.word_tokenize(text)
    pos = nltk.pos_tag(tokens)
    #print(pos)
    sentt = nltk.ne_chunk(pos, binary = False)
    person_list = []
    person = []
    name = ""
    for subtree in sentt.subtrees(filter=lambda t: t.label() == 'PERSON'):
        for leaf in subtree.leaves():
            person.append(leaf[0])
            #print(person)
        if len(person) > 1: #avoid grabbing lone surnames
            for part in person:
                name += part + ' '
            if name[:-1] not in person_list:
                person_list.append(name[:-1])
            name = ''
        person = []

    return (person_list)


def get_organization_list(text):
    doc = nlp(text)
    org_list=[]
    for ent in doc.ents:
        if ent.label_ == 'ORG':
            org_list.append(ent.text)
    return org_list
        #rint(ent.text, ent.start_char, ent.end_char, ent.label_)

def get_date(text):
    date = re.findall(r'\d+\S\d+\S\d+|[A-Z]\w+\s\d+', text)
    date = ''.join(date)
    return date

# Get human name
# names = get_human_names(text)
# for name in names:
#     first_last = HumanName(name).first + ' ' + HumanName(name).last
#     print(first_last)
#
#
#
#
# # Get date
# print(get_date(text))
#     #print(re.findall(r'[A-Z]\w+\s\d+', text))
#
#
# # Get org
# organizations = get_organization_list(text)
# print(''.join(organizations))