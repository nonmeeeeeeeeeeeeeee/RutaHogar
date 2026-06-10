-- Migration: Agregar estado 'procesado' y tipo 'oposicion' a arco_requests

alter table public.arco_requests
  drop constraint if exists arco_requests_estado_check,
  add constraint arco_requests_estado_check
    check (estado in ('pendiente', 'en_proceso', 'rechazado', 'procesado'));

alter table public.arco_requests
  drop constraint if exists arco_requests_tipo_check,
  add constraint arco_requests_tipo_check
    check (tipo in ('acceso', 'rectificacion', 'cancelacion', 'oposicion', 'otro'));
