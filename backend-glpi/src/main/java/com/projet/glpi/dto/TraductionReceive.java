package com.projet.glpi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TraductionReceive {
    public Integer langue;
    public String traduction;    
}
