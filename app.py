import os
from flask import Flask, make_response, render_template, request, send_file, redirect, url_for, jsonify
from PyPDF2 import PdfReader
import pandas as pd
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
TEMP_FOLDER = os.path.join(UPLOAD_FOLDER, 'temp')
os.makedirs(TEMP_FOLDER, exist_ok=True)

DATOS_EXTRAIDOS = []

def contar_hojas(pdf_reader):
    return len(pdf_reader.pages)

def buscar_contenido_despues_de_palabra_clave(texto, palabra_clave, max_palabras):
    contenido = ''
    for _ in range(max_palabras):
        inicio = texto.find(palabra_clave)
        if inicio != -1:
            texto = texto[inicio + len(palabra_clave):]
            palabras = texto.split()[:max_palabras]
            contenido = ' '.join(palabras)
    return contenido.strip()

def buscar_cadenas(texto_pdf, cadenas):
    resultado = {}
    for cadena in cadenas:
        resultado[cadena] = cadena.lower() in texto_pdf.lower()
    return resultado

def extract_data_from_pdfs():
    DATOS_EXTRAIDOS.clear()

    for pdf_filename in os.listdir(TEMP_FOLDER):
        pdf_path = os.path.join(TEMP_FOLDER, pdf_filename)
        pdf_reader = PdfReader(pdf_path)

        num_hojas = contar_hojas(pdf_reader)
        texto_pdf = ''

        for page in pdf_reader.pages:
            texto_pdf += page.extract_text()

        resultado = {
            'CARPETA DE ORIGEN': TEMP_FOLDER,
            'NOMBRE DEL PDF': pdf_filename,
            'FOLIOS': num_hojas,
        }

        cadenas_a_buscar = ["Salva Parcialmente el Voto", "Salva el Voto", "Aclara el Voto", "Aclara Parcialmente el Voto", "ACLARACIÓN DE VOTO"]
        resultado.update(buscar_cadenas(texto_pdf, cadenas_a_buscar))

        PALABRAS_CLAVE = ['delito', 'punible', '906', '600', '1095', '1407', 'resuelve', 'procesado', 'voto']
        for palabra_clave in PALABRAS_CLAVE:
            if palabra_clave in ['906', '600', '1095', '1407']:
                resultado[palabra_clave] = palabra_clave in texto_pdf
            elif palabra_clave in ['resuelve', 'procesado']:
                contenido = buscar_contenido_despues_de_palabra_clave(texto_pdf.lower(), palabra_clave, 5)
                resultado[palabra_clave.upper()] = contenido
            elif palabra_clave in ['delito', 'punible']:
                contenido = buscar_contenido_despues_de_palabra_clave(texto_pdf.lower(), palabra_clave, 15)
                resultado[palabra_clave.upper()] = contenido
            elif palabra_clave == 'voto':
                inicio = texto_pdf.lower().find(palabra_clave)
                if inicio != -1:
                    texto_anterior = texto_pdf[max(0, inicio - 1):inicio]
                    texto_posterior = texto_pdf[inicio + len(palabra_clave):inicio + len(palabra_clave) + 2]
                    resultado[palabra_clave.upper()] = f'{texto_anterior} {palabra_clave} {texto_posterior}'

        DATOS_EXTRAIDOS.append(resultado)

    df = pd.DataFrame(DATOS_EXTRAIDOS)
    excel_output = BytesIO()
    ARCHIVO_EXCEL = 'datos_extraidos.xlsx'
    writer = pd.ExcelWriter(excel_output, engine='xlsxwriter')
    df.to_excel(writer, index=False)
    writer.save()

    excel_output.seek(0)
    excel_output.save(os.path.join(app.config['UPLOAD_FOLDER'], ARCHIVO_EXCEL))

    return ARCHIVO_EXCEL

@app.route('/')
def index():
    return render_template('templates.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    try:
        for key in request.files:
            pdf = request.files[key]
            if pdf.filename == '':
                return jsonify({'error': 'No se seleccionaron archivos PDF.'})
            pdf.save(os.path.join(TEMP_FOLDER, pdf.filename))

        return jsonify({'message': 'Archivos PDF cargados exitosamente.'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/success')
def success():
    return 'Datos extraídos correctamente. <a href="/download_excel">Descargar Excel</a>'

@app.route('/extract_data', methods=['GET'])
def extract_data():
    try:
        archivo_excel = extract_data_from_pdfs()
        return jsonify({'message': 'Datos extraídos correctamente.'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/download_excel', methods=['GET', 'POST'])
def download_excel():
    try:
        archivo_excel = extract_data_from_pdfs()
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'], archivo_excel), as_attachment=True, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    except Exception as e:
        return jsonify({'error': str(e)})
