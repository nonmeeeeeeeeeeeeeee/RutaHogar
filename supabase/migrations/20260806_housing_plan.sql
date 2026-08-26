-- Migration: Agregar columna housing_plan a evaluations para la confirmación del plan de ahorro vivienda

alter table public.evaluations
  add column if not exists housing_plan jsonb;
