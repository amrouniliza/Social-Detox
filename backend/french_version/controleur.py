from flask import Flask, request, jsonify
from flask_cors import CORS  # Import de CORS
import psycopg2
from detect_image import detect_violent_content
from langage_sein import filter_and_reformulate_message, is_toxic
import base64

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://my-express-app-1058119729143.us-central1.run.app"}}) 

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

# Endpoint pour détecter le texte vulgaire et violent
@app.route('/detect-text', methods=['POST'])
def detect_text():
    data = request.json
    text_content = data.get("text", "")
    api_key = data.get("api_key", "")
    
    # Vérification des entrées
    if not text_content or not api_key:
        return jsonify({"error": "Text and API key are required"}), 400

    try:
        # Utilise la fonction pour reformuler et vérifier la toxicité du texte
        filtered_message, is_toxic = filter_and_reformulate_message(text_content, api_key)
        return jsonify({"filtered_message": filtered_message, "is_toxic": is_toxic}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint pour vérifier si un texte est toxique
@app.route('/is-toxic', methods=['POST'])
def detect_toxicity():
    data = request.json
    text_content = data.get("text", "")
    api_key = data.get("api_key", "")

    if not text_content or not api_key:
        return jsonify({"error": "Text and API key are required"}), 400

    try:
        # Vérifier si le texte est toxique
        toxicity_status = is_toxic(text_content, api_key)
        return jsonify({"is_toxic": toxicity_status}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint pour détecter les images sensibles
@app.route('/detect-image', methods=['POST'])
def detect_image():
    data = request.json
    image_base64 = data.get("image_base64")
    api_key = data.get("api_key")

    # Vérification des entrées
    if not image_base64 or not api_key:
        return jsonify({"error": "Image and API key are required"}), 400

    # Utilise la fonction depuis detect_image.py
    try:
        is_sensitive = detect_violent_content(image_base64, api_key)
        if is_sensitive:
            return jsonify({"message": "L'image contient du contenu sensible."}), 200
        else:
            return jsonify({"message": "L'image ne contient pas de contenu sensible."}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint pour ajouter un mot au dictionnaire
@app.route('/add-word', methods=['POST'])
def add_word():
    data = request.json
    word = data.get('word')
    replacement = data.get('replacement')
    
    if not word or not replacement:
        return jsonify({"error": "Word and replacement are required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database."}), 500
    
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO replacement_dict (word, replacement) VALUES (%s, %s) ON CONFLICT (word) DO NOTHING",
            (word, replacement)
        )
        conn.commit()
        return jsonify({"message": f"Le mot '{word}' a été ajouté avec succès."}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Endpoint pour supprimer un mot du dictionnaire
@app.route('/delete-word', methods=['DELETE'])
def delete_word():
    data = request.json
    word = data.get('word')

    if not word:
        return jsonify({"error": "Word is required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database."}), 500
    
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM replacement_dict WHERE word = %s", (word,))
        conn.commit()
        return jsonify({"message": f"Le mot '{word}' a été supprimé."}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Endpoint pour mettre à jour un mot dans le dictionnaire
@app.route('/update-word', methods=['PUT'])
def update_word():
    data = request.json
    word = data.get('word')
    new_replacement = data.get('replacement')

    if not word or not new_replacement:
        return jsonify({"error": "Word and new replacement are required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database."}), 500
    
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "UPDATE replacement_dict SET replacement = %s WHERE word = %s",
            (new_replacement, word)
        )
        conn.commit()
        return jsonify({"message": f"Le remplacement du mot '{word}' a été mis à jour."}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
