import re
import requests
import psycopg2

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

# Charger le dictionnaire depuis la base de données PostgreSQL
def load_replacement_dict():
    """
    Charger les mots interdits et leurs remplacements depuis la table PostgreSQL.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT word, replacement FROM replacement_dict")
    rows = cursor.fetchall()

    replacement_dict = {row[0]: row[1] for row in rows}

    cursor.close()
    conn.close()
    
    return replacement_dict

# Fonction pour normaliser les mots (réduction des répétitions de lettres)
def normalize_word(word):
    """
    Réduit les répétitions excessives de lettres dans un mot pour détecter des variantes.
    Par exemple, 'puuuuute' devient 'pute'.
    """
    return re.sub(r'(.)\1+', r'\1', word)  # Réduit les lettres répétées en une seule occurrence

# Fonction pour nettoyer les espaces superflus
def clean_text(text):
    """
    Supprime les espaces avant, après et réduit les espaces multiples entre les mots à un seul espace.
    """
    return ' '.join(text.split())

# Fonction pour reformuler un message via le dictionnaire de remplacement
def censor_and_replace_text(text_content, replacement_dict):
    """
    Censure et reformule les mots interdits présents dans le texte en utilisant le dictionnaire.
    """
    text_content = clean_text(text_content)  # Nettoyage des espaces superflus
    words = text_content.split()
    censored_words = []

    for word in words:
        clean_word = re.sub(r'\W+', '', word).lower()  # Enlever les caractères spéciaux et normaliser
        normalized_word = normalize_word(clean_word)  # Normaliser en réduisant les répétitions

        if normalized_word in replacement_dict:
            censored_words.append(replacement_dict[normalized_word])  # Remplacer par un terme poli
        else:
            censored_words.append(word)  # Garder le mot tel quel s'il n'est pas dans le dictionnaire

    return ' '.join(censored_words)

# Analyse de sensibilité avec Google Cloud Natural Language API
def analyze_text_sensitivity(text_content, api_key):
    """
    Utilise Google Cloud Natural Language API pour analyser la sensibilité d'un texte.
    """
    url = f"https://language.googleapis.com/v1/documents:analyzeSentiment?key={api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "document": {
            "type": "PLAIN_TEXT",
            "content": text_content
        },
        "encodingType": "UTF8"
    }

    response = requests.post(url, headers=headers, json=body)

    if response.status_code != 200:
        raise Exception(f"Error: {response.status_code}, {response.text}")

    result = response.json()
    sentiment_score = result["documentSentiment"]["score"]

    # Si le score est inférieur à -0.5, c'est potentiellement agressif
    return sentiment_score < -0.5

# Fonction principale pour filtrer et reformuler le message
# Fonction principale pour filtrer et reformuler le message
def filter_and_reformulate_message(text_content, api_key):
    """
    Filtre le message, reformule s'il contient des mots interdits et renvoie un booléen si le texte est toxique.
    """
    replacement_dict = load_replacement_dict()  # Charger les mots depuis PostgreSQL

    # Étape 1: Reformuler les mots vulgaires du message
    reformulated_text = censor_and_replace_text(text_content, replacement_dict)

    # Vérifier si un mot vulgaire est toujours présent après reformulation
    if reformulated_text != text_content:
        # Le texte a été modifié par le remplacement, donc il est potentiellement toxique
        return reformulated_text, True  # True indique que le texte était toxique
    else:
        # Étape 2: Si aucun mot vulgaire n'est reformulé, analyser la violence du texte via Google API
        is_violent = analyze_text_sensitivity(reformulated_text, api_key)

        # Si le message est violent, renvoyer comme toxique
        if is_violent:
            return "Votre message contient un langage violent ou inapproprié. Veuillez le reformuler.", True

        # Sinon, renvoyer le texte reformulé et indiquer qu'il n'est pas toxique
        return reformulated_text, False


def is_toxic(text_content, api_key):
    """
    Vérifie si le texte contient des mots toxiques dans le dictionnaire.
    Si aucun mot n'est trouvé, utilise l'API Google Natural Language pour déterminer la toxicité.
    Renvoie True si le texte est toxique, False sinon.
    """
    replacement_dict = load_replacement_dict()  # Charger les mots depuis PostgreSQL

    # Nettoyer le texte
    text_content = clean_text(text_content)
    words = text_content.split()

    # Étape 1: Vérifier si un mot du dictionnaire est présent
    for word in words:
        clean_word = re.sub(r'\W+', '', word).lower()
        normalized_word = normalize_word(clean_word)

        if normalized_word in replacement_dict:
            # Si un mot toxique est trouvé, retourner True
            return True

    # Étape 2: Si aucun mot toxique n'est trouvé, vérifier via Google API
    is_violent = analyze_text_sensitivity(text_content, api_key)

    # Si le texte est violent, retourner True
    if is_violent:
        return True

    # Si rien n'est détecté, retourner False
    return False