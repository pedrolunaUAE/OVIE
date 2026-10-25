-- Catálogo de búsqueda de localidades y municipios de Nayarit para /ovie/search/areas
-- (SearchAreasMapper.xml usa ovie_web.localidades_busqueda).
-- ovie_web.localidades solo trae 55 localidades urbanas y ovie_web.municipios 3 de 20,
-- así que el catálogo se completa con las claves de marco_2009 (manzanas) y del DENUE.
-- Geometría por localidad, en orden de preferencia:
--   1. polígono de ovie_web.localidades
--   2. envolvente convexa de sus manzanas en marco_2009
--   3. envolvente convexa de sus unidades económicas del DENUE con 300 m de margen
-- Municipios: polígono de ovie_web.municipios o, si no existe, unión de sus localidades.
-- Ejecutar después de restaurar la base: psql -U ovie -d ovie -f catalogo_busqueda_nayarit.sql

BEGIN;

DROP TABLE IF EXISTS ovie_web.localidades_busqueda;

CREATE TABLE ovie_web.localidades_busqueda (
    gid serial PRIMARY KEY,
    cvegeo varchar(9) NOT NULL,
    tipo varchar(20) NOT NULL,
    nombre varchar(200) NOT NULL,
    nom_mun varchar(200) NOT NULL,
    fuente varchar(20) NOT NULL,
    the_geom geometry(MultiPolygon, 900913) NOT NULL
);

WITH nombres_loc AS (
    SELECT cve_ent || cve_mun || cve_loc AS cvegeo,
           mode() WITHIN GROUP (ORDER BY nom_loc) AS nom_loc,
           mode() WITHIN GROUP (ORDER BY nom_mun) AS nom_mun
    FROM ovie_web.denue
    WHERE cve_ent = '18' AND cve_loc IS NOT NULL
    GROUP BY 1
), nombres_mun AS (
    SELECT cve_ent || cve_mun AS cvemun,
           mode() WITHIN GROUP (ORDER BY nom_mun) AS nom_mun
    FROM ovie_web.denue
    WHERE cve_ent = '18'
    GROUP BY 1
), oficial AS (
    SELECT left(cvegeo, 9) AS cvegeo, nomgeo, nom_mun,
           ST_Multi(ST_SetSRID(the_geom, 900913)) AS geom
    FROM ovie_web.localidades
), manzanas AS (
    SELECT left(cvegeo, 9) AS cvegeo,
           ST_ConvexHull(ST_Collect(the_geom)) AS geom
    FROM ovie_web.marco_2009
    WHERE left(cvegeo, 2) = '18'
    GROUP BY 1
), denue AS (
    SELECT cve_ent || cve_mun || cve_loc AS cvegeo,
           ST_Buffer(ST_ConvexHull(ST_Collect(the_geom)), 300) AS geom
    FROM ovie_web.denue
    WHERE cve_ent = '18' AND cve_loc IS NOT NULL
    GROUP BY 1
), claves AS (
    SELECT cvegeo FROM oficial
    UNION SELECT cvegeo FROM manzanas
    UNION SELECT cvegeo FROM denue
)
INSERT INTO ovie_web.localidades_busqueda (cvegeo, tipo, nombre, nom_mun, fuente, the_geom)
SELECT c.cvegeo,
       'Localidad',
       COALESCE(o.nomgeo, NULLIF(trim(n.nom_loc), '')),
       COALESCE(o.nom_mun, n.nom_mun, nm.nom_mun, 'Municipio ' || substr(c.cvegeo, 3, 3)),
       CASE WHEN o.geom IS NOT NULL THEN 'localidades'
            WHEN m.geom IS NOT NULL THEN 'marco_2009'
            ELSE 'denue' END,
       ST_Multi(ST_CollectionExtract(ST_MakeValid(COALESCE(o.geom, m.geom, d.geom)), 3))
FROM claves c
LEFT JOIN oficial o USING (cvegeo)
LEFT JOIN manzanas m USING (cvegeo)
LEFT JOIN denue d USING (cvegeo)
LEFT JOIN nombres_loc n USING (cvegeo)
LEFT JOIN nombres_mun nm ON nm.cvemun = left(c.cvegeo, 5)
-- Sin nombre quedan las claves 7xxx/9xxx del DENUE (viviendas dispersas), que no son localidades buscables.
WHERE COALESCE(o.geom, m.geom, d.geom) IS NOT NULL
  AND COALESCE(o.nomgeo, NULLIF(trim(n.nom_loc), '')) IS NOT NULL;

-- ST_CollectionExtract(..., 3) deja vacía cualquier geometría que no sea polígono.
DELETE FROM ovie_web.localidades_busqueda WHERE ST_IsEmpty(the_geom);

INSERT INTO ovie_web.localidades_busqueda (cvegeo, tipo, nombre, nom_mun, fuente, the_geom)
SELECT l.cvemun,
       'Municipio',
       l.nom_mun,
       l.nom_mun,
       CASE WHEN mu.the_geom IS NOT NULL THEN 'municipios' ELSE 'union_localidades' END,
       COALESCE(ST_Multi(ST_SetSRID(mu.the_geom, 900913)), l.geom)
FROM (
    SELECT left(cvegeo, 5) AS cvemun,
           min(nom_mun) AS nom_mun,
           ST_Multi(ST_CollectionExtract(ST_Union(ST_Buffer(the_geom, 0)), 3)) AS geom
    FROM ovie_web.localidades_busqueda
    WHERE tipo = 'Localidad'
    GROUP BY 1
) l
LEFT JOIN ovie_web.municipios mu ON mu.cvegeo = l.cvemun;

CREATE INDEX localidades_busqueda_geom_idx ON ovie_web.localidades_busqueda USING gist (the_geom);

COMMIT;

SELECT tipo, fuente, count(*) FROM ovie_web.localidades_busqueda GROUP BY 1, 2 ORDER BY 1, 2;
