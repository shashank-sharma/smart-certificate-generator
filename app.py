from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# set the project root directory as the static folder, you can set others.
app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')

CORS(app)


@app.route('/users/ping')
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    }), 200


if __name__ == '__main__':
    app.run()
