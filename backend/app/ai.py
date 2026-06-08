import os
from pathlib import Path

try:
    from groq import Groq
except ImportError:
    Groq = None
 

_env_path = Path(__file__).resolve().parent.parent / ".env"
if _env_path.exists():
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())
 
def _ask_groq(prompt: str, max_tokens: int = 300) -> str:
    """Wrapper interno que llama a llama-3.1-8b-instant vía Groq."""
    if Groq is None:
        return "Resumen IA no disponible en entorno local."

    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return "Resumen IA no disponible: GROQ_API_KEY no configurada."

    client = Groq(api_key=api_key)
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.4,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"ERROR IA: {str(e)}"


def generate_executive_summary(
    classification: str,
    score: float,
    positive_indicators: list,
    risks: list,
) -> str:
    """
    Resumen ejecutivo para el ejecutivo comercial.
    Explica por qué el lead obtuvo esa clasificación y qué tan preparado está.
    """
    positivos_txt = "\n".join(f"- {p}" for p in positive_indicators) or "- Sin indicadores positivos"
    riesgos_txt   = "\n".join(f"- {r}" for r in risks) or "- Sin riesgos detectados"

    prompt = f"""Eres un analista/ejecutivo comercial inmobiliario experto.
Redacta un resumen ejecutivo breve (máximo 100 palabras) dirigido a un ejecutivo comercial, NO al cliente.

Datos del lead:
- Score: {score}/100
- Clasificación: {classification}

Indicadores positivos:
{positivos_txt}

Riesgos detectados:
{riesgos_txt}

El resumen debe:
1. Explicar en una frase por qué obtuvo la clasificación "{classification}".
2. Indicar qué tan preparado está el lead para avanzar en un proceso hipotecario.
3. Ser directo y útil para que el ejecutivo decida cómo priorizar este lead.

NO debes:
1. Hablar en primera persona por ningún motivo
Responde solo el resumen, sin títulos ni encabezados."""

    return _ask_groq(prompt, max_tokens=200)


def generate_commercial_guidance(
    classification: str,
    score: float,
    positive_indicators: list,
    risks: list,
    recommendations: list,
) -> str:
    """
    Sugiere una acción comercial concreta al ejecutivo según el perfil del lead.
    """
    riesgos_txt        = "\n".join(f"- {r}" for r in risks) or "- Sin riesgos relevantes"
    recomendaciones_txt = "\n".join(f"- {r}" for r in recommendations) or "- Sin recomendaciones"
    positive_indicators_txt = "\n".join(f"- {p}" for p in positive_indicators) or"- Sin indicadores positivos"
    

    prompt = f"""Eres un ejecutivo comercial inmobiliario experimentado.

Lead a evaluar:
- Clasificación: {classification}

Score: {score}/100

Riesgos del lead:
{riesgos_txt}

Indicadores positivos del lead:
{positive_indicators_txt}

Recomendaciones del sistema:
{recomendaciones_txt}

Indica UNA sola acción comercial concreta para este lead.
Debe ser una de estas: "Contactar pronto", "Agendar reunión", "Mantener seguimiento", o "Recontactar en algunos meses", o algo del estilo
Luego debes explicar la razón del por qué esa recomendación, considerando toda la evaluación.

Formato de respuesta (respeta exactamente este formato):
Acción: [nombre de la acción]\n
Motivo: [explicación en máximo 30 palabras]

NO debes:
1. Hablar en primera persona por ningún motivo
"""

    return _ask_groq(prompt, max_tokens=120)


def generate_user_explanation(
    classification: str,
    score: float,
    positive_indicators: list,
    risks: list,
) -> str:
    positivos_txt = "\n".join(f"- {p}" for p in positive_indicators) or "- Sin indicadores positivos"
    riesgos_txt   = "\n".join(f"- {r}" for r in risks) or "- Sin riesgos detectados"

    prompt = f"""Eres un asesor financiero hipotecario que habla directamente con una persona interesada en comprar vivienda.
Redacta UN párrafo de entre 80 y 120 palabras explicando los principales factores que influyeron en su evaluación.

Datos de la evaluación:
- Score: {score}/100
- Clasificación: {classification}

Factores positivos:
{positivos_txt}

Factores de riesgo:
{riesgos_txt}

El párrafo debe:
1. Mencionar brevemente lo que jugó a su favor.
2. Explicar de manera constructiva los factores de riesgo.
3. Usar un tono empático e informativo, sin tecnicismos ni fórmulas.
4. Hablar directamente al usuario en segunda persona (tú).
5. No mencionar el puntaje exacto ni los umbrales del sistema.

Responde solo el párrafo, sin títulos ni encabezados."""

    return _ask_groq(prompt, max_tokens=250)
