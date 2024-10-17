from flask import Flask, request, jsonify
import psycopg2
import re
import requests
import base64

app = Flask(__name__)

# Connexion à la base de données PostgreSQL
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="34.30.37.4",  # L'adresse IP de votre instance Cloud SQL
            dbname="dictionary_db",  # Le nom de la base de données
            user="postgres",  # Votre utilisateur PostgreSQL
            password="epsi2025",  # Votre mot de passe PostgreSQL
            port="5432"  # Port par défaut de PostgreSQL
        )
        print("Connexion réussie à la base de données.")
        return conn
    except Exception as e:
        print(f"Erreur de connexion à la base de données : {e}")
        return None

# Fonction pour détecter si une image contient du contenu sensible
def detect_violent_content(encoded_image, api_key):
    """
    Utilise Google Cloud Vision API pour détecter si une image contient du contenu sensible.
    :param encoded_image: Image encodée en base64.
    :param api_key: Clé API Google Cloud Vision.
    :return: True si le contenu est sensible, sinon False.
    """
    # Construire la requête
    url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "requests": [
            {
                "image": {
                    "content": encoded_image
                },
                "features": [
                    {
                        "type": "SAFE_SEARCH_DETECTION"
                    }
                ]
            }
        ]
    }

    # Envoyer la requête à l'API Google Cloud Vision
    response = requests.post(url, headers=headers, json=body)

    # Vérifier si la requête a réussi
    if response.status_code != 200:
        raise Exception(f"Error: {response.status_code}, {response.text}")

    # Traiter la réponse JSON
    result = response.json()
    safe_search = result["responses"][0]["safeSearchAnnotation"]

    # Retourner True si le contenu est sensible
    sensitive_likelihoods = ["LIKELY", "VERY_LIKELY"]
    return (
        safe_search["adult"] in sensitive_likelihoods or
        safe_search["violence"] in sensitive_likelihoods or
        safe_search["racy"] in sensitive_likelihoods or
        safe_search["medical"] in sensitive_likelihoods or
        safe_search["spoof"] in sensitive_likelihoods
    )

# Endpoint pour vérifier si une image contient du contenu sensible
@app.route('/detect-image', methods=['POST'])
def detect_image():
    data = request.json
    image_base64 = data.get("image_base64")
    api_key = data.get("api_key")

    if not image_base64 or not api_key:
        return jsonify({"error": "Image and API key are required"}), 400

    is_sensitive = detect_violent_content(image_base64, api_key)
    
    if is_sensitive:
        return jsonify({"message": "L'image contient du contenu sensible."})
    else:
        return jsonify({"message": "L'image ne contient pas de contenu sensible."})

if __name__ == '__main__':
    app.run(debug=True)
