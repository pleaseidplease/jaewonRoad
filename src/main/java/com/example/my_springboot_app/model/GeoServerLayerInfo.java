package com.example.my_springboot_app.model;

public class GeoServerLayerInfo {
    private String url;
    private String workspace;
    private String layerName;
    private String style;

    // 생성자
    public GeoServerLayerInfo(String url, String workspace, String layerName, String style) {
        this.url = url;
        this.workspace = workspace;
        this.layerName = layerName;
        this.style = style;
    }

    // Getter
    public String getUrl() {
        return url;
    }

    public String getWorkspace() {
        return workspace;
    }

    public String getLayerName() {
        return layerName;
    }

    public String getStyle() {
        return style;
    }
}
