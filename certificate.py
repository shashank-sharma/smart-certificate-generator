from PyPDF2 import PdfFileWriter, PdfFileReader
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth

from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfpage import PDFTextExtractionNotAllowed
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfdevice import PDFDevice
from pdfminer.layout import LAParams
from pdfminer.converter import PDFPageAggregator

from filter_toolbox import get_organization_list, get_human_names, get_date
import pdfminer
import uuid


def parse_obj(lt_objs):
    temp_data = []
    summary = ''

    # loop over the object list
    for obj in lt_objs:

        # if it's a textbox, print text and location
        if isinstance(obj, pdfminer.layout.LTTextBoxHorizontal):

            summary = text = obj.get_text()
            print('text=', text)
            if text.strip():
                for c in obj._objs:
                    print(c.__dict__)
                    if isinstance(c, pdfminer.layout.LTChar):
                        print(c.ncs.name)

            main_text = obj.get_text()[:-1].split('\n')
            temp_counter = 0
            for temp_main_text in main_text:
                temp_data.append({'x1': obj.bbox[0], 'y1': obj.bbox[1] + temp_counter,
                                  'x2': obj.bbox[2], 'y2': obj.bbox[3] + temp_counter,
                                  'text': temp_main_text.replace('\n', '')})
                temp_counter += 30
            # print %6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', '_'))
        elif isinstance(obj, pdfminer.layout.LTTextLineHorizontal):
            text = obj.get_text()
            if text.strip():
                for c in obj._objs:
                    if isinstance(c, pdfminer.layout.LTChar):
                        print(c.ncs.name)
            parse_flag = 0
            for temp in temp_data:
                if temp['y1'] == obj.bbox[1]:
                    temp['text'] += obj.get_text().replace('\n', '')
                    temp['x2'] += obj.bbox[2] - temp['x2']
                    parse_flag = 1
                    break
            if parse_flag == 0:
                temp_data.append({'x1': obj.bbox[0], 'y1': obj.bbox[1],
                                  'x2': obj.bbox[2], 'y2': obj.bbox[3],
                                  'text': obj.get_text().replace('\n', '')})

        # if it's a container, recurse
        elif isinstance(obj, pdfminer.layout.LTFigure):
            parse_obj(obj._objs)
    return temp_data, summary


def generate_pdf_object_data(filename):
    # Open a PDF file.
    fp = open('./static/img/' + filename, 'rb')

    # Create a PDF parser object associated with the file object.
    parser = PDFParser(fp)

    # Create a PDF document object that stores the document structure.
    # Password for initialization as 2nd parameter
    document = PDFDocument(parser)

    # Check if the document allows text extraction. If not, abort.
    if not document.is_extractable:
        raise PDFTextExtractionNotAllowed

    # Create a PDF resource manager object that stores shared resources.
    rsrcmgr = PDFResourceManager()

    # Create a PDF device object.
    device = PDFDevice(rsrcmgr)

    # BEGIN LAYOUT ANALYSIS
    # Set parameters for analysis.
    laparams = LAParams()

    # Create a PDF page aggregator object.
    device = PDFPageAggregator(rsrcmgr, laparams=laparams)

    # Create a PDF interpreter object.
    interpreter = PDFPageInterpreter(rsrcmgr, device)

    # get first page of pdf
    page  = next(PDFPage.create_pages(document))

    # read the page into a layout object
    interpreter.process_page(page)
    layout = device.get_result()

    # extract text from this object
    return parse_obj(layout._objs)


"""
Next Step of execution, using previous data and using it to create
new certificate

"""


def generate_certificate(filename, data, summary, user_data):
    print('summary=', summary)
    print('data=', data, type(data))
    packet = BytesIO()
    # create a new PDF with Reportlab
    can = canvas.Canvas(packet, pagesize=letter)
    existing_pdf = PdfFileReader(open('./static/template/' + filename + '.pdf', "rb"))
    _, _, width, height = list(existing_pdf.getPage(0).mediaBox)
    output = PdfFileWriter()

    org_list = get_organization_list(summary)
    name = get_human_names(summary)
    date = get_date(summary)

    print(org_list)
    print(name)
    print(date)


    # Registered font family
    pdfmetrics.registerFont(TTFont('OpenSans', './static/fonts/OpenSans-Regular.ttf'))
    pdfmetrics.registerFont(TTFont('Old-English', './static/fonts/Old-English.ttf'))
    # Registered fontfamily
    registerFontFamily('Old-English', normal='Old-English')
    registerFontFamily('OpenSans', normal='OpenSans')

    for temp in data:
        print(temp)
        factor = abs(temp['y2'] - temp['y1'])
        if factor != 0:
            factor = factor // 1.45
        else:
            factor = 16
        if factor > 40:
            font_style = 'Old-English'
        else:
            font_style = 'OpenSans'
        # Setfont for whole pdf.
        can.setFont(font_style, factor)

        # Joining whole content together.
        # content = "Certificate Of Excellence"
        content = temp['text']
        if content in org_list:
            content = user_data['company']
        elif org_list and org_list[0] in content:
            content = content.replace(org_list[0], user_data['company'])
        elif content in name:
            content = user_data['name']
        elif name and name[0] in content:
            content = content.replace(name[0], user_data['name'])
        # elif content in date:
        #     content = user_data['date']
        # elif date in content:
        #     content = content.replace(date, user_data['date'])
        # print(content)
        text_width = stringWidth(content, font_style, factor)
        # print(text_width)

        # drawString location calculation.
        # x = (float(width) - float(text_width)) // 2; y = int(height) - 150
        x = temp['x1']
        y = temp['y1']
        # First string.
        can.drawString(x, y, content)

    # Create PDF.
    can.save()
    packet.seek(0)
    new_pdf = PdfFileReader(packet)
    # read your existing PDF

    # add the "watermark" (which is the new pdf) on the existing page
    page = existing_pdf.getPage(0)
    page.mergePage(new_pdf.getPage(0))
    output.addPage(page)
    # finally, write "output" to a real file
    certificate_id = "CID" + str(uuid.uuid4().node)
    outputStream = open('./static/certificates/' + certificate_id + ".pdf", "wb")
    output.write(outputStream)
    outputStream.close()
    return certificate_id
