package mx.org.inegi.geo.ovie.web.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.model.ProviderInfo;
import mx.org.inegi.geo.ovie.service.SearchProvidersService;
import mx.org.inegi.geo.ovie.util.Pagination;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

@RestController
@RequestMapping("providers")
public class SearchProvidersController {

	@Autowired
	SearchProvidersService service;

	@Autowired
	private Pagination pagination;

	@RequestMapping(value = "search/pagination", method = RequestMethod.POST)
	public Object searchPagination(@Valid @RequestBody ProviderInfo info) {
		int recordCount = service.selectCount(info);
		int limit = info.getLimit();
		int pages = pagination.getNumberOfPages(recordCount, limit);
		int currentPage = pagination.validatePage(info.getPage(), pages);
		int offset = pagination.getOffset(currentPage, limit);
		info.setOffset(offset);
		List<Map<String, Object>> providers = service.search(info);
		if (providers != null) {
			return ResponseFactory.successful("providers", providers).addField("recordCount", recordCount)
					.addField("numberOfPages", pages).addField("currentPage", currentPage).addField("pageSize", limit);
		} else {
			return ResponseFactory.unsuccessful("No se encontro ningun dato");
		}
	}

	@RequestMapping(value = "search", method = RequestMethod.POST)
	public Object search(@Valid @RequestBody ProviderInfo info) {
		List<Map<String,Object>> providers = service.search(info);
		if (providers != null) 
			return ResponseFactory.successful("providers", providers);
			else
			return ResponseFactory.unsuccessful("No se encontro ningun dato");
		
	}
	
	
	
	@RequestMapping(value = "catalog", method = RequestMethod.POST)
	public Object catalog() {
		List<LinkedHashMap<String, Object>> providers = service.catalogProviders();
		if (providers != null)
			return ResponseFactory.successful("providers", providers);
		else
			return ResponseFactory.unsuccessful();

	}

	@RequestMapping(value = "catalog/{id}", method = RequestMethod.POST)
	public Object catalogChildren(@PathVariable Integer id) {
		List<LinkedHashMap<String, Object>> providers = service.catalogProvidersId(id);
		if (providers != null)
			return ResponseFactory.successful("providers", providers);
		else
			return ResponseFactory.unsuccessful();

	}

}
