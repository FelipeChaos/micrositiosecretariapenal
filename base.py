import pandas as pd

# URL de tu archivo de SharePoint
sharepoint_url = "https://etbcsj.sharepoint.com/:x:/r/sites/scpenal/GESTION%202023/TRAMITES%20ADMINISTRATIVOS/2023%20ACTAS,%20PROYECTOS%20APROBADOS,%20PROVIDENCIAS/2023%20PROVIDENCIAS.xlsx?d=w4b421095b5c04b80841635701d38fba1&csf=1&web=1&e=XdJtdW"

# Leer el archivo Excel desde SharePoint en un DataFrame de pandas
df = pd.read_excel(sharepoint_url)

# Ahora puedes trabajar con los datos en el DataFrame (df)
# Por ejemplo, puedes imprimir las primeras filas
print(df.head())
