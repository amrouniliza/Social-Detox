from flask import Flask, request, jsonify
from transformers import pipeline
import os
from flask_cors import CORS

app = Flask(__name__)
classifier = pipeline("text-classification", model="unitary/toxic-bert")

# Autoriser les requêtes provenant de ton domaine Express uniquement
CORS(app, resources={r"/*": {"origins": "https://my-express-app-1058119729143.us-central1.run.app"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://my-express-app-1058119729143.us-central1.run.app')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response

@app.route('/detect_insult', methods=['POST', 'OPTIONS'])
def detect_insult():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200

    try:
        data = request.get_json()
        text = data['text']

        result = classifier(text)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
