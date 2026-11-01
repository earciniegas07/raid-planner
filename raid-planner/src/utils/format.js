export const formatDate = (iso) =>
  new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

export const ATTENDANCE_LABEL = {
  Pending: 'Pendiente',
  Confirmed: 'Confirmado',
  Declined: 'Se bajó',
};