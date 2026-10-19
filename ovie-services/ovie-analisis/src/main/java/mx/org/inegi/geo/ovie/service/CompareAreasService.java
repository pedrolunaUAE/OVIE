/**
 * 
 */
package mx.org.inegi.geo.ovie.service;

import java.util.LinkedHashMap;

/**
 * @author JUAN.LEOS
 *
 */
public interface CompareAreasService {
	
	public  float dynamicUrban(int id);

	/**
	 * @param id
	 * @return
	 */
	public float averageGrade(int id);

	/**
	 * @param id
	 * @return
	 */
	public float goodsAccess(int id);

	/**
	 * @param id
	 * @return
	 */
	public float employedPersonnel(int id);

	/**
	 * @param id
	 * @return
	 */
	public float indeco(Integer id);

	/**
	 * @param id
	 * @return
	 */
	public float productivityLaboral(Integer id);

	/**
	 * @param id
	 * @return
	 */
	public float publicTransport(Integer id);

	/**
	 * @param id
	 * @return
	 */
	public float parkinglots(Integer id);
	
	/**
	 * @param id
	 * @return
	 */
	public float urbanEquipment(Integer id);

	/**
	 * @param id
	 * @param scian
	 * @return
	 */
	public LinkedHashMap<String, Object> getDelegation(Integer id);

	/**
	 * @param cvegeo
	 * @param scian
	 * @return
	 */
	public float administrativeSalary(String cvegeo, String scian);

	/**
	 * @param cvegeo
	 * @param scian
	 * @return
	 */
	public float administrativeOperating(String cvegeo, String scian);

	/**
	 * @param cvegeo
	 * @param scian
	 * @return
	 */
	public float electricityConsumption(String cvegeo, String scian);

	/**
	 * @param cvegeo
	 * @param scian
	 * @return
	 */
	public float waterConsumption(String cvegeo, String scian);

	/**
	 * @param cvegeo
	 * @param scian
	 * @return
	 */
	public float avergaeSells(String cvegeo, String scian);

	/**
	 * @param cvegeo
	 * @param scian
	 * @return
	 */
	public float assetValue(String cvegeo, String scian);



}
