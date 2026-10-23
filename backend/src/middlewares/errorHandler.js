export default function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = Number.isInteger(error?.status) && error.status >= 400 && error.status < 500
    ? error.status
    : 500;
  const mensaje = status === 500
    ? 'Error interno del servidor'
    : error.message || 'Solicitud no válida';

  res.status(status).json({ error: mensaje });
}
