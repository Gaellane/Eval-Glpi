package com.projet.glpi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusTraduction {
    Integer id;
    Integer value;
    String name;
    String color;
    List<TraductionReceive> traductions;
}
