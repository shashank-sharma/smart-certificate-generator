import pytesseract
from pytesseract import Output
import cv2
import img2pdf
from PIL import Image
import uuid


def image_to_pdf(filename, template_id):
    # storing image path
    img_path = "./static/template/" + filename

    # storing pdf path
    pdf_path = "./static/template/" + template_id + ".pdf"

    # opening image
    image = Image.open(img_path)

    # converting into chunks using img2pdf
    pdf_bytes = img2pdf.convert(image.filename)

    # opening or creating pdf file
    file = open(pdf_path, "wb")

    # writing pdf files with chunks
    file.write(pdf_bytes)

    # closing image file
    image.close()

    # closing pdf file
    file.close()


def inverte(imagem):
    imagem = (255 - imagem)
    return imagem


def generate_image_template(filename):
    template_id = "TID" + str(uuid.uuid4().node)
    outputFile = template_id + '.' + filename.split('.')[-1]
    img = cv2.imread('./static/img/' + filename)

    d = pytesseract.image_to_data(img, output_type=Output.DICT)
    n_boxes = len(d['level'])

    for i in range(n_boxes):
        if d['text'][i] != '' and len(d['text'][i]) != 1:
            (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
            # aaa = cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            crop_img = img[y:y + h, x:x + w]
            crop_img_2 = img[y - 10: (y - 10) + h, x - 10:(x - 10) + w]
            b, g, r = crop_img_2[0, 0]
            gray = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)
            text_color = (255, 255, 255)
            if b > 240 or g > 240 or r > 240:
                print(d['text'][i])
                gray = inverte(gray)
                font_color_flag = 1
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU)[1]
            cv2.rectangle(img, (x, y), (x + w, y + h), (int(b), int(g), int(r)), -1)
    cv2.imwrite('./static/template/' + outputFile, img)
    image_to_pdf(outputFile, template_id)
    return template_id


def parse_image(filename):
    img = cv2.imread('./static/img/' + filename)

    d = pytesseract.image_to_data(img, output_type=Output.DICT)
    n_boxes = len(d['level'])

    temp_data = []
    summary = ''
    for i in range(n_boxes):
        if d['text'][i] != '' and len(d['text'][i]) != 1:
            (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
            # aaa = cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            crop_img = img[y:y + h, x:x + w]
            crop_img_2 = img[y - 10: (y - 10) + h, x - 10:(x - 10) + w]
            b, g, r = crop_img_2[0, 0]
            gray = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)
            text_color = (255, 255, 255)
            if b > 240 or g > 240 or r > 240:
                print(d['text'][i])
                gray = inverte(gray)
                font_color_flag = 1
            ran_flag = 0
            ran_flag_2 = 0
            for tt in temp_data:
                if y == tt['y1']:
                    ran_flag = 1
                    tt['x2'] += w
                    tt['text'] += d['text'][i] + ' '
                    summary += d['text'][i] + ' '
            if ran_flag == 0:
                for j in range(y - 7, y + 7):
                    for tt in temp_data:
                        if j == tt['y1']:
                            tt['x2'] += w
                            tt['text'] += d['text'][i] + ' '
                            summary += d['text'][i] + ' '
                            ran_flag_2 = 1
                            break
                    if ran_flag_2 == 1:
                        break
                if ran_flag_2 == 0:
                    temp_data.append({
                        'x1': x,
                        'y1': y,
                        'x2': x + w,
                        'y2': y + h,
                        'text': d['text'][i] + ' '
                    })
                    summary += d['text'][i] + ' '
    return temp_data, summary
