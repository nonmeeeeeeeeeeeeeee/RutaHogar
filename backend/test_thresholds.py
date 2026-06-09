import sys
import os

# Añadir el directorio backend al sys.path para importar el paquete app.scoring
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.scoring import calculate_score

def test_tc_004_alto():
    print("Ejecutando TC-004 (Parte 1): Validar umbral para clasificación 'Alto' (>= 70)")
    data = {
        "ingreso_mensual": 400000,
        "deuda_mensual": 0,
        "ahorro_disponible": 100000,
        "plazo_credito_hipotecario": 20,
        "tipo_contrato": "indefinido",
        "continuidad_laboral": "mas_3_anios",
        "morosidad_actual": "no",
        "dividendo_estimado": 100000,
        "complemento_renta": False
    }
    # Base: 50
    # ingreso >= 4 * dividendo (400k >= 400k): +25 -> 75
    # deuda <= 0.4 * ingreso (0 <= 160k): +0
    # ahorro >= dividendo (100k >= 100k): +0 (sin comuna)
    # contrato = indefinido: +10 -> 85
    # continuidad = mas_3_anios: +5 -> 90
    # morosidad = no: +0
    result = calculate_score(data)
    print(f"Score obtenido: {result['score']}")
    print(f"Clasificación esperada: Alto | Obtenida: {result['classification']}")
    assert result['classification'] == "Alto", f"Error en TC-004-Alto: {result}"
    print("TC-004 (Alto) PASSED.\n")

def test_tc_004_medio():
    print("Ejecutando TC-004 (Parte 2): Validar umbral para clasificación 'Medio' (>= 40 y < 70)")
    data = {
        "ingreso_mensual": 400000,
        "deuda_mensual": 0,
        "ahorro_disponible": 0,
        "plazo_credito_hipotecario": 20,
        "tipo_contrato": "independiente",
        "continuidad_laboral": "entre_6_y_12_meses",
        "morosidad_actual": "no",
        "dividendo_estimado": 100000,
        "complemento_renta": False
    }
    # Base: 50
    # ingreso >= 4 * dividendo (400k >= 400k): +25 -> 75
    # deuda <= 0.4 * ingreso: +0
    # ahorro < dividendo (0 < 100k): -10 -> 65
    # contrato = independiente con continuidad limitada: alerta moderada
    # continuidad = entre_6_y_12_meses: -8 -> 52
    # morosidad = no: +0
    result = calculate_score(data)
    print(f"Score obtenido: {result['score']}")
    print(f"Clasificación esperada: Medio | Obtenida: {result['classification']}")
    assert result['classification'] == "Medio", f"Error en TC-004-Medio: {result}"
    print("TC-004 (Medio) PASSED.\n")

def test_tc_005_bajo():
    print("Ejecutando TC-005: Validar umbral para clasificación 'Bajo' (< 40) y clamp")
    data = {
        "ingreso_mensual": 300000,
        "deuda_mensual": 200000,
        "ahorro_disponible": 0,
        "plazo_credito_hipotecario": 20,
        "tipo_contrato": "independiente",
        "continuidad_laboral": "menos_6_meses",
        "morosidad_actual": "si",
        "dividendo_estimado": 100000,
        "complemento_renta": False
    }
    # Base: 50
    # ingreso < 4 * dividendo (300k < 400k): -15 -> 35
    # deuda > 0.4 * ingreso (200k > 120k): -20 -> 15
    # ahorro < dividendo (0 < 100k): -10 -> 5
    # contrato = independiente: -5 -> 0
    # continuidad = menos_6_meses: -15 -> -15
    # morosidad = si: -30 -> -45
    # Clamp -> 0
    result = calculate_score(data)
    print(f"Score obtenido: {result['score']}")
    print(f"Clasificación esperada: Bajo | Obtenida: {result['classification']}")
    assert result['classification'] == "Bajo", f"Error en TC-005-Bajo: {result}"
    print("TC-005 (Bajo) PASSED.\n")

if __name__ == "__main__":
    print("--- INICIANDO PRUEBAS DE CLASIFICACIÓN (CA2) ---")
    test_tc_004_alto()
    test_tc_004_medio()
    test_tc_005_bajo()
    print("--- TODAS LAS PRUEBAS PASARON EXITOSAMENTE ---")
