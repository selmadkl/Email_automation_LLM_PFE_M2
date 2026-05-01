
import re
import unicodedata
import html
from bs4 import BeautifulSoup


def extraire_corps_email(msg):
    texte = ""

    if hasattr(msg, 'text') and msg.text:
        texte = msg.text
    elif hasattr(msg, 'html') and msg.html:
        soup = BeautifulSoup(msg.html, "html.parser")
        texte = soup.get_text(separator="\n")
    elif hasattr(msg, 'walk'):
        for part in msg.walk():
            disposition = str(part.get("Content-Disposition", ""))
            if "attachment" in disposition:
                continue
            ct = part.get_content_type()
            if ct == "text/plain":
                payload = part.get_payload(decode=True)
                charset = part.get_content_charset() or "utf-8"
                texte   = payload.decode(charset, errors="replace")
                break
            elif ct == "text/html" and not texte:
                payload  = part.get_payload(decode=True)
                charset  = part.get_content_charset() or "utf-8"
                html_str = payload.decode(charset, errors="replace")
                soup     = BeautifulSoup(html_str, "html.parser")
                texte    = soup.get_text(separator="\n")

    texte = texte.replace('\\n', '\n')  # ← fix \n littéraux
    texte = re.sub(r'\n{3,}', '\n\n', texte)
    texte = re.sub(r'[ \t]+', ' ', texte)
    return texte.strip()


def nettoyer_texte(texte):
    if not texte:
        return ""

    texte = texte.replace('\\n', '\n')  # ← fix \n littéraux
    texte = html.unescape(texte)
    texte = unicodedata.normalize('NFKC', texte)
    texte = re.sub(r'<[^>]+>', '', texte)
    texte = re.sub(r'https?://\S+|www\.\S+', '', texte)
    texte = re.sub(r'\S+@\S+\.\S+', '', texte)
    texte = re.sub(
        r'^(De\s*:|From\s*:|Date\s*:|Envoyé\s*:|Sent\s*:|À\s*:|To\s*:|Cc\s*:|Objet\s*:|Subject\s*:)[^\n]*\n?',
        '', texte, flags=re.MULTILINE | re.IGNORECASE
    )
    texte = re.sub(
        r'(--|__|\*\*|Cordialement|Regards|Best regards|Sent from my|De mon iPhone).*',
        '', texte, flags=re.IGNORECASE | re.DOTALL
    )
    texte = re.sub(r'^>.*$', '', texte, flags=re.MULTILINE)
    texte = re.sub(
        r'(Le\s.{10,80}a écrit\s?:|On\s.{10,80}wrote\s?:).*',
        '', texte, flags=re.IGNORECASE | re.DOTALL
    )
    texte = re.sub(r'(\+?\d[\d\s\-().]{7,})', '', texte)
    texte = re.sub(r'[^\w\s,.;:!?()\'\"\-\n€%/]', ' ', texte)
    texte = re.sub(r'\n{3,}', '\n\n', texte)
    texte = re.sub(r'[ \t]+', ' ', texte)
    return texte.strip()
def extraire_message_recent(corps: str) -> str:
   # Dans cleaner.py    # Liste de marqueurs très stricte
    marqueurs = [
        r"Le\s.*\sà\s.*\sa\sécrit\s:", 
        r"---------- Forwarded message ---------",
        r"On\s.*\swrote:",
        r"________________________________"
    ]
    for m in marqueurs:
        # On coupe et on ne garde que ce qui est AVANT le marqueur
        parts = re.split(m, corps, flags=re.IGNORECASE)
        if len(parts) > 1:
            return parts[0].strip()
    return corps.strip()

def extraire_contenu_pertinent(sujet: str, corps: str) -> str:
    sujet_lower = (sujet or "").lower()
    est_transfert = sujet_lower.startswith("fwd:") or sujet_lower.startswith("tr:")
    if est_transfert:
        return corps
    else:
        return extraire_message_recent(corps)