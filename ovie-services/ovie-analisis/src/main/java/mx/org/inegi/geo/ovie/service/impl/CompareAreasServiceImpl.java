/**
 * 
 */
package mx.org.inegi.geo.ovie.service.impl;

import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.persistence.CompareAreasMapper;
import mx.org.inegi.geo.ovie.persistence.EconomicVocationMapper;
import mx.org.inegi.geo.ovie.service.CompareAreasService;

/**
 * @author JUAN.LEOS
 *
 */
@Service
public class CompareAreasServiceImpl implements CompareAreasService {
	@Autowired
	CompareAreasMapper mapper;
	@Autowired
	EconomicVocationMapper mapperEconomic;

	/*
	 * (non-Javadoc)
	 * 
	 * @see mx.org.inegi.geo.ovie.service.CompareAreasService#dynamicUrban()
	 */
	@Override
	public float dynamicUrban(int id) {

		return mapper.dynamicUrban(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see mx.org.inegi.geo.ovie.service.CompareAreasService#averageGrade(int)
	 */
	@Override
	public float averageGrade(int id) {
		return mapper.averageGrade(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see mx.org.inegi.geo.ovie.service.CompareAreasService#goodsAccess(int)
	 */
	@Override
	public float goodsAccess(int id) {
		// TODO Auto-generated method stub
		return mapper.goodsAccess(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#employedPersonnel(int)
	 */
	@Override
	public float employedPersonnel(int id) {
		return mapper.employedPersonnel(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see mx.org.inegi.geo.ovie.service.CompareAreasService#indeco(int)
	 */
	@Override
	public float indeco(Integer id) {
		// TODO Auto-generated method stub
		return mapperEconomic.indeco(id.longValue());
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#productivityLaboral(
	 * java.lang.Integer)
	 */
	@Override
	public float productivityLaboral(Integer id) {
		// TODO Auto-generated method stub
		return mapper.productivityLaboral(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#publicTransport(java.
	 * lang.Integer)
	 */
	@Override
	public float publicTransport(Integer id) {
		// TODO Auto-generated method stub
		return mapper.publicTransport(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#parkinglots(java.lang.
	 * Integer)
	 */
	@Override
	public float parkinglots(Integer id) {
		// TODO Auto-generated method stub
		return mapper.parkinglots(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#equipment(java.lang.
	 * Integer)
	 */
	@Override
	public float urbanEquipment(Integer id) {
		// TODO Auto-generated method stub
		return mapper.urbanEquipment(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#getDelegation(java.lang
	 * .Integer, java.lang.String)
	 */
	@Override
	public LinkedHashMap<String, Object> getDelegation(Integer id) {
		// TODO Auto-generated method stub
		return mapper.getDelegation(id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#administrativeSalary(
	 * java.lang.String, java.lang.String)
	 */
	@Override
	public float administrativeSalary(String cvegeo, String scian) {
		// TODO Auto-generated method stub
		return mapper.administrativeSalary(cvegeo, scian);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#administrativeOperating
	 * (java.lang.String, java.lang.String)
	 */
	@Override
	public float administrativeOperating(String cvegeo, String scian) {
		// TODO Auto-generated method stub
		return mapper.administrativeOperating(cvegeo, scian);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#electricityConsumption(
	 * java.lang.String, java.lang.String)
	 */
	@Override
	public float electricityConsumption(String cvegeo, String scian) {
		// TODO Auto-generated method stub
		return mapper.electricityConsumption(cvegeo, scian);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#waterConsumption(java.
	 * lang.String, java.lang.String)
	 */
	@Override
	public float waterConsumption(String cvegeo, String scian) {
		// TODO Auto-generated method stub
		return mapper.waterConsumption(cvegeo, scian);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#avergaeSells(java.lang.
	 * String, java.lang.String)
	 */
	@Override
	public float avergaeSells(String cvegeo, String scian) {
		// TODO Auto-generated method stub
		return mapper.avergaeSells(cvegeo, scian);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * mx.org.inegi.geo.ovie.service.CompareAreasService#assetValue(java.lang.
	 * String, java.lang.String)
	 */
	@Override
	public float assetValue(String cvegeo, String scian) {
		// TODO Auto-generated method stub
		return mapper.assetValue(cvegeo, scian);
	}

}
