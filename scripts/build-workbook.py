"""Build the original LectorLab pilot workbook. Requires reportlab + Pillow."""
import json
import math
import sys
from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
from fontTools.ttLib import TTFont as FontToolsFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'docs/dinero-con-criterio.json').read_text())
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'public/downloads/lectorlab-dinero-con-criterio-piloto.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
for name, weight in [('Space',400),('SpaceBold',700)]:
    font=FontToolsFont(str(ROOT/'public/fonts/SpaceGrotesk.ttf'))
    if 'fvar' in font:font=instantiateVariableFont(font,{'wght':weight},inplace=True)
    buffer=BytesIO();font.save(buffer);buffer.seek(0)
    pdfmetrics.registerFont(TTFont(name,buffer))
pdfmetrics.registerFont(TTFont('Instrument', str(ROOT / 'public/fonts/InstrumentSerif-Italic.ttf')))
INK = HexColor('#121212')
PAPER = HexColor('#F5F3EA')
LIME = HexColor('#D7FF3F')
RED = HexColor('#F04432')
MUTED = HexColor('#55564F')
LINE = HexColor('#C3C3B9')
W, H = 595.28, 841.89
M = 48
CW = W - 2*M
c = canvas.Canvas(str(OUT), pagesize=(W,H), pageCompression=1)
c.setTitle('LectorLab - Dinero con criterio - Cuaderno piloto de 21 días')
c.setAuthor('LectorLab / Nicolás Rodríguez')
c.setSubject('Ejercicios originales para explorar una decisión de consumo con ayuda de una lectura. Edición piloto sin validación comercial.')
page = 0
text_bounds = []

def para(text, x, y, width=CW, size=12, leading=None, color=INK, font='Space'):
    p = Paragraph(escape(text).replace('\n','<br/>'), ParagraphStyle('t', fontName=font, fontSize=size, leading=leading or size*1.45, textColor=color, splitLongWords=True))
    _, height = p.wrap(width,H)
    p.drawOn(c,x,y-height)
    text_bounds.append((page,y,y-height,text[:50]))
    return y-height

def star(x,y,r=11,color=RED):
    c.saveState();c.setStrokeColor(color);c.setLineWidth(3.8)
    for a in (0,math.pi/4,math.pi/2,math.pi*3/4):
        c.line(x-r*math.cos(a),y-r*math.sin(a),x+r*math.cos(a),y+r*math.sin(a))
    c.restoreState()

def logo(x=M,y=H-47):
    c.setFillColor(INK);c.setFont('SpaceBold',22);c.drawString(x,y,'lectorlab');star(x+115,y+8,8)

def start(label, title, sub=None):
    global page
    page += 1
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    logo();c.setFillColor(MUTED);c.setFont('Space',8);c.drawRightString(W-M,H-44,'RUTA 01 / EDICIÓN PILOTO 0.2')
    c.setStrokeColor(INK);c.setLineWidth(.7);c.line(M,H-68,W-M,H-68)
    para(label,M,H-96,size=9,color=MUTED)
    y=para(title,M,H-125,size=33,leading=36,font='SpaceBold')
    if sub:y=para(sub,M,y-17,size=12,color=MUTED)
    c.setFillColor(MUTED);c.setFont('Space',8)
    c.drawString(M,30,'EL PODER DE ENTENDER / LECTORLAB')
    c.drawRightString(W-M,30,f'{page:02d}')
    return y-30

def end():c.showPage()

def block(label,text,y,color=None):
    if color:
        c.setFillColor(color);c.roundRect(M,y-100,CW,100,4,fill=1,stroke=0)
        para(label,M+16,y-14,width=CW-32,size=9)
        para(text,M+16,y-37,width=CW-32,size=11)
        return y-120
    y=para(label,M,y,size=9,color=MUTED)
    return para(text,M,y-10,size=12)-24

def writing(label,y,lines=3):
    y=para(label,M,y,size=10)
    c.setStrokeColor(LINE);c.setLineWidth(.6)
    for _ in range(lines):
        y-=24;c.line(M,y,W-M,y)
    return y-24

def peter(name,x,y,size):
    im=Image.open(ROOT/'public/assets'/name).convert('RGBA')
    c.drawImage(ImageReader(im),x,y,width=size,height=size,mask='auto')

# Cover
page=1
c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0);logo()
para('RUTA 01 / CUADERNO ORIGINAL DE 21 DÍAS',M,H-106,size=10)
para('Dinero\ncon criterio.',M,H-160,size=62,leading=61,font='SpaceBold')
para('De la idea a la acción.',M,H-306,size=31,font='Instrument')
para('Una lectura. Una decisión de consumo.\nUn criterio que puedas explicar.',M,H-365,size=14)
c.setFillColor(LIME);c.circle(W-65,165,220,fill=1,stroke=0)
peter('peter-reading-v2.webp',215,15,350)
para('PETER TE ACOMPAÑA.\nLA DECISIÓN ES TUYA.',M,220,width=180,size=10)
para('EDICIÓN PILOTO 0.2\nPara pruebas de uso; sin ventas abiertas.',M,84,width=220,size=9,color=MUTED)
end()

y=start('ANTES DE EMPEZAR','Una decisión\nque entiendas mejor.','Este cuaderno es una herramienta para pensar una compra con ayuda de una lectura. No necesitas leer rápido ni terminar un libro en 21 días.')
y=block('LA META', 'Si completas el recorrido, tendrás una pregunta concreta, una ficha de lectura, una observación registrada y una regla personal con sus límites.',y,LIME)
y=block('LO QUE NECESITAS','Un libro al que tengas acceso, un lápiz o tu aplicación de notas y una compra no esencial que quieras explorar. No hace falta comprar nada para hacer los ejercicios.',y)
y=block('TU RITMO','Reserva unos diez minutos para escribir cada día. La lectura y las observaciones pueden requerir tiempo adicional. Si saltas un día, continúa donde lo dejaste.',y)
y=block('UN LÍMITE CLARO','No es asesoramiento financiero, terapia ni un plan de ahorro. No necesitas compartir importes ni información privada. Los 21 días organizan el recorrido; no garantizan crear un hábito.',y)
end()

y=start('EL MAPA','Pregunta.\nContrasta. Aplica.','Una pregunta cotidiana puede abrir una lectura. El valor aparece al explicar qué harás con esa idea y qué no puedes concluir.')
for number,title,body in [('01 / DÍAS 1-7','Encuentra la pregunta.','Elige un caso, busca una lectura, explica una idea y realiza la primera observación.'),('02 / DÍAS 8-14','Mira qué hay detrás.','Explora motivos, contexto, alternativas y otra perspectiva. Mejora tu pregunta.'),('03 / DÍAS 15-21','Escribe tu criterio.','Diseña una prueba pequeña, registra lo ocurrido y redacta una regla provisional.')]:
    y=block(number,title+' '+body,y)
y=block('CÓMO SABRÁS QUE AVANZAS','Marca lo que has trabajado, aunque la respuesta sea una duda. El progreso se ve en tus registros y en la precisión de tu pregunta; no en palabras por minuto.',y,LIME)
y=para('Tus notas son tuyas. Compártelas solo si quieres. Este PDF es imprimible: puedes escribir en papel o usar una aplicación que permita anotar documentos.',M,y,size=11,color=MUTED)
end()

y=start('HOJA REUTILIZABLE 01','Elige tu lectura.','Puedes fotocopiar esta hoja para otra pregunta. Los libros se consiguen por separado; no forman parte de este cuaderno.')
for label,n in [('La pregunta que quiero explorar',2),('Libro, autor y edición',1),('Cómo accedo a él y qué sección leeré',2),('Por qué puede ayudarme y qué perspectiva falta',3)]:y=writing(label,y,n)
end()

y=start('UN EJEMPLO, SIN RESPUESTA CORRECTA','De una compra\na una pregunta.','Caso ficticio para mostrar el método. No es un testimonio ni una cita de Morgan Housel.')
for label,body in [('SITUACIÓN','Quiero unos auriculares nuevos. Los míos todavía funcionan.'),('PREGUNTA','¿Qué espero obtener de esta compra, además de escuchar música?'),('LECTURA','Elijo una sección de La psicología del dinero que pueda relacionar con mi pregunta. Anoto el capítulo y explico la idea con mis palabras.'),('PRUEBA PROPIA','Antes de comparar marcas, escribiré dos usos concretos. Observaré si mi preferencia cambia. No tengo que comprar.'),('LÍMITE','Aunque cambie mi preferencia, un caso no demuestra qué causó el cambio.'),('CRITERIO PROVISIONAL','Antes de elegir un dispositivo no esencial, describiré su uso. Revisaré esta regla en la próxima ocasión.')]:y=block(label,body,y)
end()

for i,d in enumerate(DATA['days'],1):
    y=start(f'DÍA {i:02d} / 21 · {d["phase"]}',d['title'],d['intro'])
    y=block('HOY',d['task'],y)
    y=block('UN EJEMPLO FICTICIO',d['example'],y,LIME)
    # Three short work areas; enough for handwriting, also usable as a prompt.
    for q in d['questions']:y=writing(q,y,2)
    para('TE LLEVAS: '+d['output'],M,115,size=9,color=MUTED)
    para('Peter: '+d['tip'],M,88,size=11,font='Instrument')
    c.setStrokeColor(INK);c.rect(M,51,9,9,fill=0,stroke=1)
    para('He trabajado esta pregunta. Fecha:',M+17,61,size=9,color=MUTED)
    end()

y=start('HOJA REUTILIZABLE 02','Una idea\nbajo la lupa.','Sirve con cualquier lectura. Separa lo que el autor dice de lo que tú interpretas.')
for label,n in [('Idea en mis palabras y capítulo o referencia',2),('Mi interpretación y relación con mi pregunta',2),('Tipo de afirmación, apoyo y objeción',2),('Prueba pequeña: qué observaré y cuándo',2),('Qué ocurrió y qué no puedo concluir',2)]:y=writing(label,y,n)
end()

y=start('HOJA REUTILIZABLE 03','Mi regla,\ncon sus límites.','Tu criterio es revisable. No necesitas una norma para todas las compras.')
for label,n in [('Cuando ocurra esta situación...',2),('Antes de decidir, prefiero...',2),('Salvo en esta excepción...',2),('Lo sostengo por esta observación; esto aún no lo sé...',2),('Lo revisaré en esta fecha o situación...',1)]:y=writing(label,y,n)
end()

y=start('CIERRE','Lo que ahora\npuedes explicar.','No busques demostrar que el cuaderno funciona. Escribe qué te sirvió, qué no y por qué.')
for label,n in [('Mi pregunta inicial y mi pregunta actual',2),('Una idea que entiendo mejor y dónde la leí',2),('Una decisión que puedo explicar mejor',2),('Qué herramienta conservaré y qué descarto',2),('Mi siguiente pregunta y revisión',1)]:y=writing(label,y,n)
end()

y=start('EDICIÓN PILOTO / AYÚDANOS A MEJORAR','Una buena pregunta\ntambién nos toca.','Estos ejercicios son originales de LectorLab / Nicolás. Esta versión no ha demostrado resultados comerciales ni mejoras de aprendizaje en usuarios.')
for label,n in [('¿Qué ejercicio entendiste sin ayuda? ¿Dónde te atascaste?',2),('¿Qué hoja volverías a usar y qué quitarías?',2),('¿Qué te faltaría para pagar por este producto? ¿Por qué?',2)]:y=writing(label,y,n)
para('Puedes responder sin compartir tus notas personales. Si participas en una prueba, el canal y el uso de tus comentarios se acordarán contigo. No incluimos testimonios inventados.',M,y,size=11,color=MUTED)
end()

y=start('FUENTES Y ALCANCE','Leer. Recordar.\nVolver a comprobar.','Los ejercicios y ejemplos del cuaderno son propios. No reproducen ni sustituyen un libro. Las fuentes siguientes orientan el diseño, pero no validan este producto concreto.')
sources=[('LECTURA TEMÁTICA OPCIONAL','La psicología del dinero, Morgan Housel. El título y la autoría pueden verificarse en la editorial. No se presentan las preguntas del cuaderno como citas del autor.','https://www.planetadelibros.com/libro-la-psicologia-del-dinero/334390?soporte=336728'),('RECORDAR Y COMPROBAR','Retrieval Practice: guía de investigadores sobre recuperar información y comprobar el aprendizaje. Adaptamos esa idea en los días 4, 14 y 20; no prometemos un porcentaje de mejora.','https://www.retrievalpractice.org/retrievalpractice'),('VELOCIDAD Y COMPRENSIÓN','Rayner y colaboradores (2016), So Much to Read, So Little Time. La revisión cuestiona las grandes mejoras de velocidad sin coste de comprensión. Por eso aquí la velocidad no es la meta.','https://www.psychologicalscience.org/publications/journals/pspi/speed_reading.html')]
for label,body,url in sources:
    y=block(label,body,y)
    before=y;y=para(url,M,y+12,size=8,color=MUTED)-24
    c.linkURL(url,(M,y+20,W-M,before+13),relative=0,thickness=0)
para('LectorLab · El poder de entender.\nPeter es el personaje de la marca, no su nombre.\nEdición piloto 0.2 · Octubre de 2026.',M,y-2,size=11)
end()
c.save()
# Catch body/footer collisions during future content edits.
issues=[b for b in text_bounds if b[2]<42 and not (b[0]==1)]
if issues:raise ValueError(f'Text exceeds safe page area: {issues}')
print(json.dumps({'output':str(OUT),'pages':page,'days':len(DATA['days']),'status':'created'},ensure_ascii=False))
