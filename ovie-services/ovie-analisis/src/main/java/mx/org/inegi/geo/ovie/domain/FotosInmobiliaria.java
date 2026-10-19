package mx.org.inegi.geo.ovie.domain;

public class FotosInmobiliaria {
    private int gid;
    private int id_inm;
    private byte[] imagen;
    public int getId_inm() {
        return id_inm;
    }
    public FotosInmobiliaria(int id_inm, byte[] imagen) {
   	super();
   	this.id_inm = id_inm;
   	this.imagen = imagen;
       }
    public void setId_inm(int id_inm) {
        this.id_inm = id_inm;
    }
    public FotosInmobiliaria() {
    }
    public int getGid() {
        return gid;
    }
    public void setGid(int gid) {
        this.gid = gid;
    }
    public byte[] getImagen() {
        return imagen;
    }
    public void setImagen(byte[] imagen) {
        this.imagen = imagen;
    }
    
   
    
}
