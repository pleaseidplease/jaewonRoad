package com.example.my_springboot_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
	
    @GetMapping("/")
    public String GoMain() {
        return "main/main";
    }
}

