# RNF 2 - Privacidad mínima y gestión de datos personales

> **Requisito no funcional.** El usuario registrado puede gestionar su consentimiento, solicitar acciones sobre sus datos y controlar el uso de su información.

---

## Resumen

| Campo | Valor |
| :---- | :---- |
| **Categoría** | Deseable |
| **Puntos de Historia** | 3 |
| **Atributo de calidad** | Privacidad de datos |
| **Índice** | [[../AtributosDeCalidad|Atributos de calidad]] |

---

## Enunciado

> **Como** usuario registrado, **quiero** acceder a un panel de privacidad dentro de mi perfil, **para** gestionar mi consentimiento, solicitar acciones sobre mis datos y controlar el uso de mi información.

---

## Criterios de verificación

### E1 - Gestión del consentimiento

**Dado** que el usuario accede a su perfil, **cuando** entra al panel de privacidad, **entonces** debe poder ver y modificar el consentimiento asociado al uso de sus datos.

### E2 - Solicitud de descarga o rectificación

**Dado** que el usuario quiere ejercer sus derechos sobre sus datos, **cuando** elige descargar o rectificar información personal, **entonces** el sistema debe registrar la solicitud y mostrar una confirmación.

### E3 - Eliminación de cuenta

**Dado** que el usuario solicita eliminar su cuenta, **cuando** confirma la acción, **entonces** el sistema debe iniciar el proceso de eliminación total e irrecuperable según las reglas definidas.

### E4 - Recuperación de contraseña

**Dado** que el usuario olvidó su contraseña o quiere cambiarla, **cuando** solicita la recuperación, **entonces** el sistema debe permitir iniciar el flujo de restablecimiento.

---

## Notas

- Corresponde a la salvaguarda S5 del handbook: los datos financieros se tratan bajo consentimiento explícito y las solicitudes ARCO deben seguir siendo atendibles.
- El consentimiento de entrada se captura en [[../UserStories/HU1-ingreso-datos-financieros|HU 1]] E3.
