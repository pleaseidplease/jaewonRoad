package com.example.my_springboot_app.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.my_springboot_app.model.GeoServerLayerInfo;

@RestController
public class MapController {
	 @Value("${geoserver.base-url}")
	    private String baseUrl;

	    @Value("${geoserver.workspace}")
	    private String workspace;

	    @Value("${geoserver.layer-name}")
	    private String layerName;

	    @Value("${geoserver.style-name}")
	    private String styleName;

	    @GetMapping("/api/geoserver/layer-info")
	    public GeoServerLayerInfo getLayerInfo() {
	        return new GeoServerLayerInfo(baseUrl, workspace, layerName, styleName);
	    }
}

