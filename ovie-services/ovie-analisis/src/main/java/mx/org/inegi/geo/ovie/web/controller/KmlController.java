package mx.org.inegi.geo.ovie.web.controller;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
/*   4:    */ import java.io.File;
/*   5:    */ import java.io.FileOutputStream;
/*   6:    */ import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
/*  13:    */ import org.springframework.http.HttpHeaders;
/*  14:    */ import org.springframework.http.HttpStatus;
/*  15:    */ import org.springframework.http.MediaType;
/*  16:    */ import org.springframework.http.ResponseEntity;
/*  17:    */ import org.springframework.web.bind.annotation.RequestMapping;
/*  18:    */ import org.springframework.web.bind.annotation.RequestParam;
/*  19:    */ import org.springframework.web.bind.annotation.ResponseBody;
/*  20:    */ import org.springframework.web.bind.annotation.RestController;
/*  21:    */ import org.springframework.web.multipart.MultipartFile;

import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

@RestController
@RequestMapping({ "kml" })
public class KmlController {

	@RequestMapping(value = { "/upload" }, method = { org.springframework.web.bind.annotation.RequestMethod.POST })
	@ResponseBody
	public Object uploadFileKml(@RequestParam("file") MultipartFile file) throws IOException {
		if (!file.isEmpty()) {
			ByteArrayInputStream stream = new ByteArrayInputStream(file.getBytes());
			String kml = IOUtils.toString(stream, "UTF-8");

			try {
				if (kml.contains("<kml")) {
					return ResponseFactory.successful("Archivo valido").addField("kml", kml);
				}
				return ResponseFactory.successful("El archivo no es kml");
			} catch (Exception e) {
				return ResponseFactory.unsuccessful();
			}
		}
		return ResponseFactory.successful("El archivo kml se encuientra vacio");
	}

	@RequestMapping(value = { "/download" }, method = { org.springframework.web.bind.annotation.RequestMethod.POST })
	public Object dowmloadFileKml(@RequestParam("file") String gpxfile) throws IOException {
		if ((gpxfile != null) && (gpxfile.length() > 0)) {
			ZipKml zk = new ZipKml();
			byte[] file = zk.createZip(gpxfile);
			String filename = "mdmData_kml.zip";
			HttpHeaders headers = getHeadersZip(filename);
			ResponseEntity<byte[]> responseEntity = new ResponseEntity<byte[]>(file, headers, HttpStatus.OK);
			return responseEntity;
		}
		return ResponseFactory.unsuccessful("El archivo kml viene vacio");
	}

	private HttpHeaders getHeadersZip(String filename) {
		HttpHeaders headers = new HttpHeaders();
		MediaType excelMediaType = new MediaType("application", "zip");
		headers.setContentType(excelMediaType);
		headers.setDate(System.currentTimeMillis());
		headers.setContentDispositionFormData("attachment", filename);
		return headers;
	}

	@RequestMapping(value = { "/uploadMultipleFile" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.POST })

	public String uploadMultipleFileHandler(@RequestParam("name") String[] names,
			@RequestParam("file") MultipartFile[] files) {
		if (files.length != names.length) {
			return "Mandatory information missing";
		}
		String message = "";
		for (int i = 0; i < files.length; i++) {
			MultipartFile file = files[i];
			String name = names[i];
			try {
				byte[] bytes = file.getBytes();

				String rootPath = System.getProperty("catalina.home");
				File dir = new File(rootPath + File.separator + "tmpFiles");
				if (!dir.exists()) {
					dir.mkdirs();
				}
				File serverFile = new File(dir.getAbsolutePath() + File.separator + name);

				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));

				stream.write(bytes);
				stream.close();

				message = message + "You successfully uploaded file=" + name + "<br />";
			} catch (Exception e) {
				return "You failed to upload " + name + " => " + e.getMessage();
			}
		}
		return message;
	}

	public class ZipKml {
		private byte[] zipIt(byte[] files) throws IOException {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			ZipOutputStream zipfile = new ZipOutputStream(bos);
			String fileName = null;
			ZipEntry zipentry = null;
			fileName = "mdmData.kml";
			zipentry = new ZipEntry(fileName);
			zipfile.putNextEntry(zipentry);
			zipfile.write(files);
			zipfile.close();
			return bos.toByteArray();
		}

		public byte[] createZip(String s) throws IOException {
			return zipIt(s.getBytes("UTF-8"));
		}
	}
}
