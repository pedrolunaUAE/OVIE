/**
 * 
 */
package mx.org.inegi.geo.ovie.util;

/**
 * @author femat
 *
 */
public class Pagination {

	public static int getNumberOfPages(int recordCount, int limit) {
		int pages = 0;
		if (recordCount == 0) {
			pages = 1;
		} else if ((recordCount % limit) == 0) {
			pages = recordCount / limit;
		} else {
			pages = (recordCount / limit) + 1;
		}
		return pages;
	}

	public static int getOffset(int page, int limit) {
		int offset = (page - 1) * limit;
		return offset;
	}

	public static int validatePage(int page, int pages) {
		if (page > pages) {
			page = pages;
		} else if (page < 0) {
			page = 1;
		}
		return page;
	}



}
