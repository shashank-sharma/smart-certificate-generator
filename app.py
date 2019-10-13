from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin
from middleware import is_required
from werkzeug.utils import secure_filename
import os

from pdf_toolbox import remove_noise
from certificate import generate_pdf_object_data, generate_certificate
from image_toolbox import generate_image_template, parse_image
from flask_sendgrid import SendGrid
from flask_sqlalchemy import SQLAlchemy

# set the project root directory as the static folder, you can set others.
app = Flask(__name__,
            static_url_path='/static/img',
            static_folder='client/build')

app.config['UPLOAD_FOLDER'] = './static/img'
app.config['SENDGRID_API_KEY'] = 'your api key'
app.config['SENDGRID_DEFAULT_FROM'] = 'admin@yourdomain.com'
app.config.from_object('config.DevelopmentConfig')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

mail = SendGrid(app)
db = SQLAlchemy(app)
CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

from models import *


@app.route('/ping', methods=['GET'])
def hello_world():
    return jsonify({'status': 'Pong'}), 200


@app.route('/create_template', methods=['POST'])
@is_required(files=['file'])
def upload_test_file():
    if request.method == 'POST':
        # check if the post request has the file part
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        file_ext = file.filename.split('.')[-1]
        if file_ext != 'pdf' and file_ext != 'png' and \
                file_ext != 'jpg' and file_ext != 'jpeg':
            return jsonify({
                'message': 'Given File Format is not supported'
            }), 400
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        if file_ext == 'pdf':
            template_id = remove_noise(filename)
        else:
            template_id = generate_image_template(filename)
            # try:
        template = Template(
            id=template_id,
            email='shashank.sharma98@gmail.com',
            name=str(filename)
        )
        db.session.add(template)
        db.session.commit()
        return jsonify({'data': {
            'id': template_id,
            'filename': filename
        }}), 200
            # except Exception as e:
            #     return jsonify({'message': 'Error Saving data'}), 400
        # return jsonify({'message': 'Error Generating File'})


@app.route('/<template_id>/generate_certificate', methods=['POST'])
def api_generate_certificate(template_id):
    name = request.json['name']
    company = request.json['company']
    # date = request.json['date']
    user_data = {'name': name, 'company': company}
    template_object = Template.query.filter_by(id=template_id).first()
    filename = template_object.serialize()['name']
    file_ext = filename.split('.')[-1]
    if file_ext == 'pdf':
        pdf_object_data, summary = generate_pdf_object_data(filename)
        certificate_id = generate_certificate(template_id, pdf_object_data, summary, user_data)
    else:
        image_object_data, summary = parse_image(filename)
        print(image_object_data)
        certificate_id = generate_certificate(template_id, image_object_data, summary, user_data)
    return jsonify({'data': {
        'id': certificate_id,
    }}), 200


@app.route('/certificate/<certificate_id>', methods=['GET'])
def api_get_certificate(certificate_id):
    print(certificate_id)
    return send_file('./static/certificates/' + certificate_id + '.pdf',
                     attachment_filename=certificate_id + '.pdf')


if __name__ == '__main__':
    app.run()
