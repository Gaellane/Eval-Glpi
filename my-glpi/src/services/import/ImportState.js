import {  saveMultiple } from "../../models/dropdowns/State";


export async function createState(file) {
    try{
        const states = await getState(file);
        const savedStates = await saveMultiple(states);
        return savedStates;

    } catch (error) {
        console.error("Error getting state:", error);
        throw error;
    }
}


async function getState(file) { 
    try{
        
        const stateInFile = file.map(element => element.status.trim());
        const states = [...new Set(stateInFile)];
        const stateCreated = states.map(state => {
            return {
                name :  state ,
                comment : state ,
                entity: {},
                is_recursive: true,
                parent: {
                    id: 0
                },
                is_visible_helpdesk: true,
                visibilities: {
                    computer: true,
                    monitor: true,
                    networkequipment: true,
                    peripheral: true,
                    phone: true,
                    printer: true,
                    softwarelicense: true,
                    certificate: true,
                    enclosure: true,
                    pdu: true,
                    line: true,
                    rack: true,
                    softwareversion: true,
                    cluster: true,
                    contract: true,
                    appliance: true,
                    databaseinstance: true,
                    cable: true,
                    unmanaged: true,
                    passivedcequipment: true
                }
            }

        });
        return stateCreated;
    } catch (error) {
        console.error("Error creating state:", error);
        throw error;
    }
}