import { apiCall } from "../api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL; 
const sessionToken = sessionStorage.getItem("user-token");
const APP_TOKEN = import.meta.env.VITE_BACKEND_GLPI_APP_TOKEN; // optionnel selon ta config
const sessionTokenV1 = sessionStorage.getItem("session-token-v1"); // token de session v1


const GLPI_ENTITIES_V2 = [

  // ── Phase 1 : ITIL ─────────────────────────────────────────────────
  {
    order: 1,
    category: "itil",
    itemtype: "Ticket",
    endpoint: "/Assistance/Ticket",
    endpointV1: "/Ticket"
  },
  // {
  //   order: 2,
  //   category: "itil",
  //   itemtype: "Problem",
  //   endpoint: "/Assistance/Problem",
  //   endpointV1: "/Problem"
  // },
  // {
  //   order: 3,
  //   category: "itil",
  //   itemtype: "Change",
  //   endpoint: "/Assistance/Change",
  //   endpointV1: "/Change"
  // },

  // ── Phase 2 : Parc / Assets ────────────────────────────────────────
  // {
  //   order: 5,
  //   category: "asset",
  //   itemtype: "Software",
  //   endpoint: "/Assets/Software",
  //   endpointV1: "/Software"
  // },
  // {
  //   order: 6,
  //   category: "asset",
  //   itemtype: "SoftwareLicense",
  //   endpoint: "/Assets/SoftwareLicense",
  //   endpointV1: "/SoftwareLicense"
  // },
  {
    order: 7,
    category: "asset",
    itemtype: "Computer",
    endpoint: "/Assets/Computer",
    endpointV1: "/Computer"
  },
  {
    order: 8,
    category: "asset",
    itemtype: "Monitor",
    endpoint: "/Assets/Monitor",
    endpointV1: "/Monitor"
  },
  {
    order: 9,
    category: "asset",
    itemtype: "NetworkEquipment",
    endpoint: "/Assets/NetworkEquipment",
    endpointV1: "/NetworkEquipment"
  },
  {
    order: 10,
    category: "asset",
    itemtype: "Printer",
    endpoint: "/Assets/Printer",
    endpointV1: "/Printer"
  },
  {
    order: 11,
    category: "asset",
    itemtype: "Phone",
    endpoint: "/Assets/Phone",
    endpointV1: "/Phone"
  },
  {
    order: 12,
    category: "asset",
    itemtype: "Peripheral",
    endpoint: "/Assets/Peripheral",
    endpointV1: "/Peripheral"
  },
  {
    order: 13,
    category: "asset",
    itemtype: "Rack",
    endpoint: "/Assets/Rack",
    endpointV1: "/Rack"
  },
  {
    order: 14,
    category: "asset",
    itemtype: "Enclosure",
    endpoint: "/Assets/Enclosure",
    endpointV1: "/Enclosure"
  },
  {
    order: 15,
    category: "asset",
    itemtype: "PDU",
    endpoint: "/Assets/PDU",
    endpointV1: "/PDU",
    note: null
  },
  {
    order: 16,
    category: "asset",
    itemtype: "PassiveDCEquipment",
    endpoint: "/Assets/PassiveDCEquipment",
    endpointV1: "/PassiveDCEquipment",
    note: null
  },
  {
    order: 17,
    category: "asset",
    itemtype: "Unmanaged",
    endpoint: "/Assets/Unmanaged",
    endpointV1: "/Unmanaged",
    note: "Assets détectés non gérés (agent GLPI)"
  },

  // ── Phase 2.5 : Composants ────────────────────────────────────────
  // { order: 18, category: "component", itemtype: "DeviceCamera",       endpoint: "/Components/Camera",       endpointV1: "/DeviceCamera" },
  // { order: 19, category: "component", itemtype: "DeviceGraphicCard",  endpoint: "/Components/GraphicCard",  endpointV1: "/DeviceGraphicCard" },
  // { order: 20, category: "component", itemtype: "DeviceNetworkCard",  endpoint: "/Components/NetworkCard",  endpointV1: "/DeviceNetworkCard" },
  // { order: 21, category: "component", itemtype: "DeviceSoundCard",    endpoint: "/Components/SoundCard",    endpointV1: "/DeviceSoundCard" },
  // { order: 22, category: "component", itemtype: "DeviceDrive",        endpoint: "/Components/Drive",        endpointV1: "/DeviceDrive" },
  // { order: 23, category: "component", itemtype: "DevicePci",          endpoint: "/Components/Pci",          endpointV1: "/DevicePci" },
  // { order: 24, category: "component", itemtype: "DevicePowerSupply",  endpoint: "/Components/PowerSupply",  endpointV1: "/DevicePowerSupply" },
  // { order: 25, category: "component", itemtype: "DeviceBattery",      endpoint: "/Components/Battery",      endpointV1: "/DeviceBattery" },
  // { order: 26, category: "component", itemtype: "DeviceCase",         endpoint: "/Components/Case",         endpointV1: "/DeviceCase" },
  // { order: 27, category: "component", itemtype: "DeviceSensor",       endpoint: "/Components/Sensor",       endpointV1: "/DeviceSensor" },
  // { order: 28, category: "component", itemtype: "DeviceSimcard",      endpoint: "/Components/Simcard",      endpointV1: "/DeviceSimcard" },
  // { order: 29, category: "component", itemtype: "DeviceMotherboard",  endpoint: "/Components/Motherboard",  endpointV1: "/DeviceMotherboard" },
  // { order: 30, category: "component", itemtype: "DeviceGeneric",      endpoint: "/Components/Generic",      endpointV1: "/DeviceGeneric" },
  // { order: 31, category: "component", itemtype: "DeviceControl",      endpoint: "/Components/Control",      endpointV1: "/DeviceControl" },
  // { order: 32, category: "component", itemtype: "DeviceHardDrive",    endpoint: "/Components/HardDrive",    endpointV1: "/DeviceHardDrive" },
  // { order: 33, category: "component", itemtype: "DeviceFirmware",     endpoint: "/Components/Firmware",     endpointV1: "/DeviceFirmware" },
  // { order: 34, category: "component", itemtype: "DeviceMemory",       endpoint: "/Components/Memory",       endpointV1: "/DeviceMemory" },
  // { order: 35, category: "component", itemtype: "DeviceProcessor",    endpoint: "/Components/Processor",    endpointV1: "/DeviceProcessor" },

  // ── Phase 2.6 : Documents ─────────────────────────────────────────
  // Document_Item doit être supprimé AVANT Document
  {
    order: 35,
    category: "document",
    itemtype: "Document_Item",
    endpoint: null,
    endpointV1: "/Document_Item",
    note: "Liens documents-items — supprimer avant les documents"
  },
  {
    order: 36,
    category: "document",
    itemtype: "Document",
    endpoint: null,
    endpointV1: "/Document",
    note: "Documents et images attachés aux assets et tickets"
  },

  // ── Phase 3 : Modèles (Item_typeModel) ───────────────────────────
  // À supprimer APRÈS les assets qui les référencent
  { order: 37, category: "dropdown_model", itemtype: "ComputerModel",          endpoint: "/Dropdowns/ComputerModel",          endpointV1: "/ComputerModel",          note: null },
  { order: 38, category: "dropdown_model", itemtype: "MonitorModel",           endpoint: "/Dropdowns/MonitorModel",           endpointV1: "/MonitorModel",           note: null },
  { order: 39, category: "dropdown_model", itemtype: "NetworkEquipmentModel",  endpoint: "/Dropdowns/NetworkEquipmentModel",  endpointV1: "/NetworkEquipmentModel",  note: null },
  { order: 40, category: "dropdown_model", itemtype: "PrinterModel",           endpoint: "/Dropdowns/PrinterModel",           endpointV1: "/PrinterModel",           note: null },
  { order: 41, category: "dropdown_model", itemtype: "PhoneModel",             endpoint: "/Dropdowns/PhoneModel",             endpointV1: "/PhoneModel",             note: null },
  { order: 42, category: "dropdown_model", itemtype: "PeripheralModel",        endpoint: "/Dropdowns/PeripheralModel",        endpointV1: "/PeripheralModel",        note: null },
  //{ order: 43, category: "dropdown_model", itemtype: "RackModel",              endpoint: "/Dropdowns/RackModel",              endpointV1: "/RackModel",              note: null },
  // { order: 44, category: "dropdown_model", itemtype: "EnclosureModel",         endpoint: "/Dropdowns/EnclosureModel",         endpointV1: "/EnclosureModel",         note: null },
  // { order: 45, category: "dropdown_model", itemtype: "PDUModel",               endpoint: "/Dropdowns/PDUModel",               endpointV1: "/PDUModel",               note: null },
  // { order: 46, category: "dropdown_model", itemtype: "PassiveDCEquipmentModel",endpoint: "/Dropdowns/PassiveDCEquipmentModel",endpointV1: "/PassiveDCEquipmentModel",note: null },
  // { order: 47, category: "dropdown_model", itemtype: "SoftwareModel",          endpoint: "/Dropdowns/SoftwareModel",          endpointV1: "/SoftwareModel",          note: null },

  // ── Phase 4 : Dropdowns de référence ─────────────────────────────
  // À supprimer EN DERNIER — référencés par presque tous les assets
  {
    order: 48,
    category: "dropdown",
    itemtype: "State",
    endpoint: "/Dropdowns/State",
    endpointV1: "/State",
    note: "État des actifs (En production, En stock, Réformé...)"
  },
  {
    order: 49,
    category: "dropdown",
    itemtype: "Manufacturer",
    endpoint: "/Dropdowns/Manufacturer",
    endpointV1: "/Manufacturer",
    note: "Constructeurs et éditeurs — référencé par Computer, Software, composants..."
  },
  {
    order: 50,
    category: "dropdown",
    itemtype: "Location",
    endpoint: "/Dropdowns/Location",
    endpointV1: "/Location",
    note: "Lieux — arborescence récursive, supprimer les enfants avant les parents"
  },
];

async function resetEntityV1(entity, onProgress = null) {
  const headersV1 = {
    "Session-Token": sessionTokenV1,
    "Content-Type": "application/json"
  };

  let deleted = 0;
  try {
    while (true) {
      const getURL = `${BASE_URL}/v1${entity.endpointV1}`;
      const res = await apiCall(getURL, "GET", headersV1, null, { only_id: true });

      const ids = res.map(i => i.id);
      const payload = {
        input: ids.map(id => ({ id: id }))
      };
      const delUrl = `${BASE_URL}/v1${entity.endpointV1}`;

      if (payload.input.length === 0) {
        break;
      }

      console.log(" [DEBUG] Deleting items - URL:", delUrl, "Payload:", payload);

      const del = await apiCall(delUrl, "DELETE", headersV1, payload, { force_purge: true });

      deleted += ids.length;
      console.log(`[${entity.itemtype}] purged ${deleted}...`);
    }

    const message = `${entity.itemtype} — ${deleted} items supprimés`;
    console.log(`[${entity.itemtype}] DONE — ${deleted} items supprimés`);

    if (onProgress) {
      onProgress({ itemtype: entity.itemtype, category: entity.category, deleted, message });
    }
  } catch (error) {
    console.error(`[${entity.itemtype}] Error during reset:`, error);
    if (onProgress) {
      onProgress({ itemtype: "ERROR", message: `${entity.itemtype}: ${error.message}` });
    }
  }
}

async function resetEntityV2(entity, onProgress = null) {
  const headers = {
    "Authorization": `Bearer ${sessionToken}`,
  };

  let deleted = 0;
  try {
    while (true) {
      const url = `${BASE_URL}/v2.3${entity.endpoint}`;
      const res = await apiCall(url, "GET", headers, null, {});

      const ids = res.map(i => i.id);

      if (ids.length === 0) {
        break; // Sécurité : évite une boucle infinie si le GET revient vide
      }

      for (const id of ids) {
        const delUrl = `${BASE_URL}/v2.3${entity.endpoint}/${id}`;
        const del = await apiCall(delUrl, "DELETE", headers, null, { force: true });
      }

      deleted += ids.length;
      console.log(`[${entity.itemtype}] purged ${deleted}...`);
    }

    const message = `${entity.itemtype} — ${deleted} items supprimés`;
    console.log(`[${entity.itemtype}] DONE — ${deleted} items supprimés`);

    if (onProgress) {
      onProgress({ itemtype: entity.itemtype, category: entity.category, deleted, message });
    }
  } catch (error) {
    console.error(`[${entity.itemtype}] Error during reset:`, error);
    if (onProgress) {
      onProgress({ itemtype: "ERROR", message: `${entity.itemtype}: ${error.message}` });
    }
  }
}

async function resetAllEntities(onProgress = null) {
  try {
    for (const entity of GLPI_ENTITIES_V2) {
      console.log(`\n=== Resetting ${entity.itemtype} (${entity.category}) ===`);
    
      await resetEntityV1(entity, onProgress);
    }
  } catch (error) {
    console.error("Fatal error during reset all entities:", error);
    if (onProgress) {
      onProgress({ itemtype: "ERROR", message: `Fatal error: ${error.message}` });
    }
  }
}

export { resetAllEntities };