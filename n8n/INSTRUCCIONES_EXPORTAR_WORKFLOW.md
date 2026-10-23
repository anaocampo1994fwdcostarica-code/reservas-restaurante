# Exportación del workflow de n8n

El archivo actual `n8n/agente-reservas.json` no contiene nodos ni conexiones. No debe sustituirse por un flujo ficticio ni por una respuesta inventada.

Ana debe abrir su instancia local de n8n, verificar el workflow que funciona con la aplicación y exportarlo manualmente. El archivo exportado debe guardarse exactamente en:

```text
n8n/agente-reservas.json
```

Antes de exportar, confirmar que el workflow real incluya y conecte estos elementos:

1. Un nodo **Webhook** que reciba la consulta del frontend.
2. Un nodo **AI Agent**.
3. Un nodo **Chat Model** configurado por Ana con sus credenciales locales.
4. Una herramienta o nodo **HTTP** para consultar mesas mediante la API local.
5. Una herramienta o nodo **HTTP** para consultar reservas mediante la API local.
6. Un nodo **Code** que forme y valide el contrato de respuesta.
7. Un nodo **Respond to Webhook** que devuelva el resultado al frontend.

El Webhook debe recibir:

```json
{
  "consulta": "texto del usuario"
}
```

La respuesta exitosa debe conservar exactamente esta estructura:

```json
{
  "ok": true,
  "data": {
    "respuesta": "..."
  },
  "error": null
}
```

Para errores controlados, se recomienda conservar el mismo contrato con `ok` en `false`, `data` en `null` y un mensaje útil en `error`.

Antes de guardar y versionar la exportación, retirar credenciales, tokens, claves de API, contraseñas y valores de archivos `.env`. Después, probar el webhook local desde el chatbot flotante y tomar la evidencia indicada en `docs/EVIDENCIAS.md`.
