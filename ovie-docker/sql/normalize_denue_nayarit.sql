-- Normaliza DENUE Nayarit para consultas OVIE (actpre, compeco, actcons).
-- Ejecutar tras restaurar bdgeoestadistico:
--   docker cp ovie-docker/sql/normalize_denue_nayarit.sql ovie-postgres:/tmp/
--   docker exec -it ovie-postgres psql -U ovie -d ovie -f /tmp/normalize_denue_nayarit.sql

UPDATE ovie_web.denue
SET cve_scian = left(LPAD(codigo_act::text, 6, '0'), 6)
WHERE codigo_act IS NOT NULL
  AND (cve_scian IS NULL OR trim(cve_scian) = '');

UPDATE ovie_web.denue
SET desc_cort = left(desc_scian, 100)
WHERE desc_scian IS NOT NULL
  AND (desc_cort IS NULL OR trim(desc_cort) = '');

UPDATE ovie_web.denue
SET sector = substring(LPAD(codigo_act::text, 6, '0'), 1, 2)
WHERE codigo_act IS NOT NULL
  AND (sector IS NULL OR trim(sector) = '');
