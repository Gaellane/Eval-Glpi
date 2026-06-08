import Papa from "papaparse";   
import { createState } from "./ImportState";
import { createLocation } from "./importLocation";  
import { createManufacturer } from "./importManufacturer";
import { createAsset } from "./importAsset";
import { createModel } from "./importModel";
import { createTicket } from "./importTicket";
import { createTicketCost } from "./importTicketCost";
import { resetAllEntities } from "../reset/reset";
import { importDocuments } from "./importDocument";
import { createUser } from "./importUser";
import { chargerDataStorage } from "../data/data";

export async function parseFile(file, id ) {
    if (!file) return;

    const retour = {};
    Papa.parse(file, {

        header: true,
        transformHeader: (header) => {
                return header.trim().toLowerCase();
        },
        skipEmptyLines: true,
        complete: (results) => {
            
            retour[id] = results.data;
            retour[headersKey(id)] = results.meta.fields;
            // console.log(" [DEBUG] Parsed data for file dans import ", id, ": ", results.data);
        }
    });
    
    return retour ;

}

function headersKey(id) {
    return `header${id}`;
}

export async function importFile(files , importImage=true) {

    try {
        // FILE 1 
        // Status 
        const file1 = files.file1.file1;
        const status = await createState(file1);
        console.log(" [DEBUG] Status : ", status);
        const locations = await createLocation(file1);
        console.log(" [DEBUG] Location : ", locations);
        const manufacturers = await createManufacturer(file1);
        console.log(" [DEBUG] Manufacturers : " ,manufacturers);
        const models = await createModel(file1);
        console.log(" [DEBUG] Models : ", models);
        const users = await createUser(file1);
        console.log(" [DEBUG] Users : ", users);
        const assets = await createAsset(file1, status, locations, models, manufacturers , users);
        console.log(" [DEBUG] Assets : ", assets);

        // FILE 2 
        const file2 = files.file2.file2;
        const tickets = await createTicket(file2, assets);
        console.log(" [DEBUG] Tickets : ", tickets);

        //FILE 3
        const file3 = files.file3.file3;
        const ticketCosts = await createTicketCost(file3, tickets);
        console.log(" [DEBUG] Ticket Costs : ", ticketCosts);
        
        // IMAGES
        if(importImage) {
            const zip = files.zip;
            const images = await importDocuments(zip, assets); 
            console.log(" [DEBUG] Imported Images : ", images);
        }

        await chargerDataStorage();


    } catch (error) {
        console.log(error);
        await resetAllEntities();
        throw error;
    }


}


