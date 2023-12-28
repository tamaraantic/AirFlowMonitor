package Project.AirFlowMonitor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("demo")
public class DemoController {
    @GetMapping
    public ResponseEntity<String> seyHello(){
        return ResponseEntity.ok("Hello. I'm secured.");
    }
}
