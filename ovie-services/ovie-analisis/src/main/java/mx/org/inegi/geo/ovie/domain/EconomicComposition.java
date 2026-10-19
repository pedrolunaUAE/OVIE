package mx.org.inegi.geo.ovie.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;

@JsonAutoDetect
public class EconomicComposition {
	@JsonIgnore
	public float comercio;
	@JsonIgnore
	public float industria;
	@JsonIgnore
	public float servicio;
	@JsonIgnore
	public float total;

	public float comerciop;

	public float industriap;

	public float serviciop;

	public String tipo;

	public float getComercio() {
		return comercio;
	}

	public void setComercio(float comercio) {
		this.total += comercio;
		this.comercio = comercio;
	}

	public float getIndustria() {
		return industria;
	}

	public void setIndustria(float industria) {
		this.total += industria;
		this.industria = industria;
	}

	public float getServicio() {
		return servicio;
	}

	public void setServicio(float servicio) {
		this.total += servicio;
		this.servicio = servicio;
	}

	public float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public float getComerciop() {
		this.comerciop = (this.comercio * 100) / this.total;
		return (float) (Math.rint(comerciop*100.0)/100.0);
	}

	public void setComerciop(float comerciop) {
		this.comerciop = comerciop;
	}

	public float getIndustriap() {
		this.industriap = (this.industria * 100) / this.total;
		//return Math.round(industriap);
		return (float) (Math.rint(industriap*100.0)/100.0);
	}

	public void setIndustriap(float industriap) {
		this.industriap = industriap;
	}

	public float getServiciop() {
		this.serviciop = (this.servicio * 100) / this.total;
		//return  Math.round(serviciop);
		return (float) (Math.rint(serviciop*100.0)/100.0);
	}

	public void setServiciop(float serviciop) {
		this.serviciop = serviciop;
	}

	public String getTipo() {
		float mayor = this.comercio;
		tipo = "comercio";
		if (industria > mayor) {
			mayor = industria;
			tipo = "industria";
		}
		if (servicio > mayor) {
			mayor = servicio;
			tipo = "servicio";
		}
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

}
