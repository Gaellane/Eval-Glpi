package com.projet.glpi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projet.glpi.model.Langue;
import com.projet.glpi.model.TicketCost;
import com.projet.glpi.repository.LangueRepository;
import com.projet.glpi.repository.TicketCostRepository;

@Service
public class TicketCostService {
    private final TicketCostRepository ticketCostRepository;

    public TicketCostService(TicketCostRepository langueRepository) {
        this.ticketCostRepository = langueRepository;
    }

    public Double getByTicketId(Integer ticketId) {
        List<TicketCost> costs= ticketCostRepository.findByTicketId(ticketId);
            System.out.println("Ticket Cost " + costs.size());

        Double retour =0.0;
        for(TicketCost c: costs) {
            retour+=(c.getSuperCost()!=null) ? c.getSuperCost() : 0;
            System.out.println("Ticket Cost " + retour);
        }
        return retour;
    }

    public TicketCost saveTickeCost(TicketCost ticketCost) {
        Double ouv =ticketCost.getOuverture();
        System.out.println("\n\n\n\n\nOuverture : "+ouv);
        if(ticketCost.getOuverture()!=null){
            List<TicketCost> costs= ticketCostRepository.findByTicketId(ticketCost.getTicketId());
            
            if(!costs.isEmpty()) {
                System.out.println("\n\n\n\n Tsy empty le ixy");
                int i = 0;
                Double last = null;
                while(last==null && i<costs.size()){
                    last = costs.get(i).getSuperCost();
                    System.out.println("last -"+last);
                    i++;
                }

                ticketCost.setOuverture(last*ouv/100);
            } else {
                ticketCost.setOuverture(0.);
            }
        }
        return ticketCostRepository.save(ticketCost);
    }

    public Double getOuverture(Integer ticketId) {
        List<TicketCost> costs= ticketCostRepository.findByTicketId(ticketId);
        Double retour =0.0;
        for(TicketCost c: costs) {
            if(c.getOuverture()!=null)
                retour+=c.getOuverture();
        }
        return retour;
    }

    public void deleteTicketCost(Integer id) {
        List<TicketCost> costs= ticketCostRepository.findByTicketId(id);
        if(costs.size()>0) {
            ticketCostRepository.delete(costs.get(costs.size()-1));
        }
    }
    
}
