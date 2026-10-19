package mx.org.inegi.geo.ovie.domain;

import java.util.List;

public class OfertaInmobiliaria {
    private String nombre;
    private String correo_electronico;
    private String calle_inmueble;
    private String no_ext;
    private String no_int;
    private String colonia;
    private String delegacion;
    private int cp;
    private String telefono;
    private int estatus;
    private int tipo_inmueble;
    private String servicios;
    private int modalidad_oferta;
    private double valor_total;
    private double valor_metro2;
    private String observaciones;
    private double superficie_metros2;
    private String ubicacion;
    private String titulo_oferta;

    public OfertaInmobiliaria(String nombre, String correo_electronico, String calle_inmueble, String no_ext,
	    String no_int, String colonia, String delegacion, int cp, String telefono, int estatus, int tipo_inmueble,
	    String servicios, int modalidad_oferta, double valor_total, double valor_metro2, String observaciones,
	    double superficie_metros2, String ubicacion, String titulo_oferta) {
	super();
	this.nombre = nombre;
	this.correo_electronico = correo_electronico;
	this.calle_inmueble = calle_inmueble;
	this.no_ext = no_ext;
	this.no_int = no_int;
	this.colonia = colonia;
	this.delegacion = delegacion;
	this.cp = cp;
	this.telefono = telefono;
	this.estatus = estatus;
	// this.id_inm = id_inm;
	// this.fotos = fotos;
	this.tipo_inmueble = tipo_inmueble;
	this.servicios = servicios;
	this.modalidad_oferta = modalidad_oferta;
	this.valor_total = valor_total;
	this.valor_metro2 = valor_metro2;
	this.observaciones = observaciones;
	this.superficie_metros2 = superficie_metros2;
	this.ubicacion = ubicacion;
	this.titulo_oferta=titulo_oferta;
    }

    public OfertaInmobiliaria() {
    }

    public String getNombre() {
	return nombre;
    }

    public void setNombre(String nombre) {
	this.nombre = nombre;
    }

    public String getCorreo_electronico() {
	return correo_electronico;
    }

    public void setCorreo_electronico(String correo_electronico) {
	this.correo_electronico = correo_electronico;
    }

    public String getCalle_inmueble() {
	return calle_inmueble;
    }

    public void setCalle_inmueble(String calle_inmueble) {
	this.calle_inmueble = calle_inmueble;
    }

    public String getColonia() {
	return colonia;
    }

    public void setColonia(String colonia) {
	this.colonia = colonia;
    }

    public String getDelegacion() {
	return delegacion;
    }

    public void setDelegacion(String delegacion) {
	this.delegacion = delegacion;
    }

    public int getCp() {
	return cp;
    }

    public void setCp(int cp) {
	this.cp = cp;
    }

    public String getTelefono() {
	return telefono;
    }

    public void setTelefono(String telefono) {
	this.telefono = telefono;
    }

    public int getStatus() {
	return estatus;
    }

    public void setStatus(int status) {
	this.estatus = status;
    }

    public int getEstatus() {
	return estatus;
    }

    public void setEstatus(int estatus) {
	this.estatus = estatus;
    }

    public String getServicios() {
	return servicios;
    }

    public void setServicios(String servicios) {
	this.servicios = servicios;
    }

    public int getModalidad_oferta() {
	return modalidad_oferta;
    }

    public void setModalidad_oferta(int modalidad_oferta) {
	this.modalidad_oferta = modalidad_oferta;
    }

    public double getValor_total() {
	return valor_total;
    }

    public void setValor_total(double valor_total) {
	this.valor_total = valor_total;
    }

    public double getValor_metro2() {
	return valor_metro2;
    }

    public void setValor_metro2(double valor_metro2) {
	this.valor_metro2 = valor_metro2;
    }

    public String getObservaciones() {
	return observaciones;
    }

    public void setObservaciones(String observaciones) {
	this.observaciones = observaciones;
    }

    public double getSuperficie_metros2() {
	return superficie_metros2;
    }

    public void setSuperficie_metros2(double superficie_metros2) {
	this.superficie_metros2 = superficie_metros2;
    }

    public int getTipo_inmueble() {
	return tipo_inmueble;
    }

    public void setTipo_inmueble(int tipo_inmueble) {
	this.tipo_inmueble = tipo_inmueble;
    }

    public String getUbicacion() {
	return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
	this.ubicacion = ubicacion;
    }

    public String getNo_ext() {
	return no_ext;
    }

    public void setNo_ext(String no_ext) {
	this.no_ext = no_ext;
    }

    public String getNo_int() {
	return no_int;
    }

    public void setNo_int(String no_int) {
	this.no_int = no_int;
    }

    public String getTitulo_oferta() {
        return titulo_oferta;
    }

    public void setTitulo_oferta(String titulo_oferta) {
        this.titulo_oferta = titulo_oferta;
    }

}
