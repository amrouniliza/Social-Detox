from flask import Flask, request, jsonify
from transformers import pipeline
import os

from flask_cors import CORS  
app = Flask(__name__)

classifier = pipeline("text-classification", model="unitary/toxic-bert")

CORS(app, resources={r"/*": {"origins": "https://my-express-app-1058119729143.us-central1.run.app"}}) 

@app.route('/detect_insult', methods=['POST'])
def detect_insult():
    try:
        data = request.get_json()
        text = data['text']

    
        result = classifier(text)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
