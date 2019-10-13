from PyPDF4 import PdfFileReader, PdfFileWriter
from PyPDF4.pdf import ContentStream
from PyPDF4.generic import TextStringObject, NameObject
from PyPDF4.utils import b_
import uuid


def remove_noise(inputFile):
    template_id = "TID" + str(uuid.uuid4().node)
    outputFile = template_id + '.' + inputFile.split('.')[-1]
    with open('./static/img/' + inputFile, "rb") as f:
        source = PdfFileReader(f, "rb")
        output = PdfFileWriter()

        for page in range(source.getNumPages()):
            page = source.getPage(page)
            content_object = page["/Contents"].getObject()
            content = ContentStream(content_object, source)

            for operands, operator in content.operations:
                if operator == b_("Tf") or operator == b_("Tj"):
                    operands[0] = TextStringObject('')

            page.__setitem__(NameObject('/Contents'), content)
            output.addPage(page)

        # try:
        with open('./static/template/' + outputFile, "wb") as outputStream:
            output.write(outputStream)
    return template_id
