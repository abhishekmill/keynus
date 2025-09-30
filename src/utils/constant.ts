export const cookieConfig = {
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
  secure: true,
  overwrite: true,
};

export const branches = [
  { label: "Office", value: "Office" },
  { label: "Education", value: "Education" },
  { label: "Retail", value: "Retail" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Industry", value: "Industry" },
  { label: "Sports And Leisure", value: "SportsAndLeisure" },
  { label: "Emergency Services", value: "EmergencyServices" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Public Spaces", value: "PublicSpaces" },
];

export const projectStatus = [
  { label: "None", value: "None" },
  { label: "New", value: "New" },
  { label: "Proposal Sent", value: "ProposalSent" },
  { label: "In Progress", value: "InProgress" },
  { label: "Complete", value: "Complete" },
  { label: "Archived", value: "archived" },
];

export const locationList = [
  { label: "Top left", value: "Top left" },
  { label: "Top right", value: "Top right" },
  { label: "Middle left", value: "Middle left" },
  { label: "Middle", value: "Middle" },
  { label: "Middle right", value: "Middle right" },
  { label: "Bottom left", value: "Bottom left" },
  { label: "Bottom right", value: "Bottom right" },
];
export const nodeList: { [key: string]: string[] } = {
  "0type_woodOne": [
    "0type_woodOne",
    "Body_Main_BackPanel",
    "Base_Main_Front",
    "Body_Main_BottomPanel",
    "Body_Main_Plinth",
    "Base_Main_Back",
    "Body_Core_BackPanel",
    "Base_Core_Front",
    "Base_Core_Top",
    "Base_Core_Back",
  ],
  "0type_woodSemi": [
    "0type_woodSemi",
    "Body_Main_BackPanel",
    "Base_Main_Front",
    "Body_Main_BottomPanel",
    "Body_Main_Plinth",
    "Base_Main_Back",
    "Body_Core_BackPanel",
    "Base_Core_Front",
    "Base_Core_Top",
    "Base_Core_Back",
  ],
  "0type_solidOne": [
    "0type_solidOne",
    "Body_Solid_UpCapFront",
    "Door_Main_Top",
    "Door_Solid_Top",
    "Body_Solid_UpInsidePanel",
    "Body_Main_UpInsidePanel",
    "Base_Solid_Front",
    "Base_Main_Front",
    "Base_Main_Back",
    "Base_Solid_Back",
    "Base_Solid_Top",
    "Base_Main_Top",
    "Body_Main_BottomPanel",
    "Body_Main_BottomPanel_origin",
    "Body_Solid_BottomPanel",
  ],
  "0type_solidTwo": [
    "0type_solidTwo",
    "Base_Main_BackSide",
    "Base_Main_FrontSide",
    "Base_Main_Top2",
    "Base_Solid_BackSide",
    "Base_Solid_FrontSide",
    "Base_Solid_Top",
    "Body_Main_BottomPanel",
    "Body_Main_UpCapFront",
    "Body_Solid_BottomPanel",
    "Body_Solid_UpCapFront",
    "Body_Main_BottomPanel_origin",
    "Door_Main_Top",
    "Door_Solid_Top",
  ],
  "0type_steelOne": [
    "0type_steelOne",
    "Body_Main_BottomPanel",
    "Body_Main_UpCap",
    // "Door_Main_Top",
    "Door_Steel_HingeBearingBottom",
  ],
  "0type_steelTwo": [
    "0type_steelTwo",
    "Body_Main_BottomPanel",
    "Body_Main_UpCap",
    // "Door_Main_Top",
  ],
  "0type_steelSlopOne": ["Body_Main_UpCap", "0type_steelSlopOne", "Body_Main_BottomPanel"],
  "0type_steelSlopTwo": ["Body_Main_UpCap", "0type_steelSlopTwo", "Body_Main_BottomPanel"],
  "0type_solidSlopOne": [
    "Body_Solid_UpCapFront",
    "Door_Main_Top",
    "Door_Solid_Top",
    "Body_Solid_UpInsidePanel",
    "Body_Main_UpInsidePanel",
    "Base_Solid_Front",
    "Base_Main_Front",
    "Base_Main_Back",
    "Base_Solid_Back",
    "Base_Solid_Top",
    "Base_Main_Top",
    "Body_Main_BottomPanel",
    "Body_Main_BottomPanel_origin",
    "Body_Solid_BottomPanel",
    "Body_Main_UpCap",
    "0type_solidSlopOne",
    "Body_Solid_UpCapTopBack",
    "Body_Main_UpCapTopBack",
  ],
  "0type_solidTwoSlop": [
    "Body_Solid_UpCapFront",
    "Door_Main_Top",
    "Door_Solid_Top",
    "Base_Solid_Front",
    "Base_Main_Front",
    "Base_Main_Back",
    "Base_Solid_Back",
    "Base_Solid_Top",
    "Base_Main_Top",
    "Body_Main_BottomPanel",
    "Body_Main_BottomPanel_origin",
    "Body_Solid_BottomPanel",
    "Body_Main_UpCap",
    "0type_solidTwoSlop",
    "Body_Solid_UpCapTopBack",
    "Body_Main_UpCapTopBack",
  ],
};

export const staticCabinetScale: { [key: number]: number } = {
  1: 0.01,
  2: 0.00499,
  3: 0.00332,
  4: 0.00247,
  5: 0.00197,
  6: 0.00164,
  7: 0.0014,
  8: 0.00123,
  9: 0.001,
  10: 0.00097,
};

export const severalImagePositions: {
  position: [number, number, number];
  rotation: [number, number, number];
}[] = [
  {
    position: [0.8660254037844389, 0.39999999999999986, 0.5],
    rotation: [3.33066907387547e-16, 1.0471975511965979, -2.884444029575347e-16],
  }, // left
  {
    position: [1.0000000000000002, 0.2, 6.123233995736767e-17],
    rotation: [1.232595164407831e-32, 1.5707963267948966, 0],
  }, // front
  {
    position: [0.8660254037844389, 0.39999999999999986, -0.4999999999999999],
    rotation: [3.141592653589793, 1.047197551196598, -3.141592653589793],
  }, //right
];

export const standardCabinetCornerValue = 0.025;
// export const standardCabinetCornerValue = 0.025;

export const pivotPosition: { [key: string]: number } = {
  default: 1.07799,
  "0type_steelOne": 1.07799,
  "0type_steelTwo": 0.983,
  "0type_solidOne": 0.983,
  "0type_solidTwo": 0.98,
  "0type_woodOne": 0.9,
  "0type_woodSemi": 0.9,
  "0type_steelSlopOne": 0.8684,
  "0type_steelSlopTwo": 0.983,
  "0type_solidSlopOne": 0.983,
  "0type_solidTwoSlop": 0.983,
};

export const rightPanelPosition: { [key: string]: number } = {
  default: 0.01,
  "0type_steelOne": 0.01,
  "0type_steelTwo": 0.008829635620117188,
  "0type_solidOne": 0.01,
  "0type_solidTwo": 0.0081,
  "0type_woodOne": 0.009,
  "0type_woodSemi": 0.0083,
  "0type_steelSlopOne": 0.0083,
  "0type_steelSlopTwo": 0.008829635620117188,
  "0type_solidSlopOne": 0.01,
  "0type_solidTwoSlop": 0.0081,
};

export const leftPanelHolePosition: { [key: string]: number } = {
  default: 0.01,
  "0type_steelOne": 0.27,
  "0type_steelTwo": 0.57,
  "0type_woodOne": 0.27,
  "0type_woodSemi": 0.27,
};

export const lockerPosition: { [key: string]: number } = {
  default: 0,
  "0type_steelOne": 0.145,
  "0type_steelTwo": 0.145,
  "0type_solidOne": 0.19,
  "0type_solidTwo": 0.196,
  "0type_woodOne": 0.19,
  "0type_woodSemi": 0.19,
  "0type_steelSlopOne": 0.145,
  "0type_steelSlopTwo": 0.145,
  "0type_solidSlopOne": 0.19,
  "0type_solidTwoSlop": 0.196,
};

export const modelTotalHeight: { [key: string]: number } = {
  default: 1.9499996185302735,
  "0type_steelOne": 1.9499996185302735,
  "0type_steelTwo": 1.95000018119812,
  "0type_solidOne": 1.95,
  "0type_solidTwo": 1.92919997215271,
  "0type_woodOne": 2.01147,
  "0type_woodSemi": 1.29,
  "0type_steelSlopOne": 2.0517,
  "0type_steelSlopTwo": 2.0517,
  "0type_solidSlopOne": 2.08,
  "0type_solidTwoSlop": 2.08,
};

export const modelBackPanelWidth: { [key: string]: number } = {
  default: 0.29804060339927674,
  "0type_steelOne": 0.29804060339927674,
  "0type_steelTwo": 0.5979857635498047,
  "0type_solidOne": 0.37744,
  "0type_solidTwo": 0.7774,
  "0type_woodOne": 0.263688,
  // "0type_woodOne": 0.255,
  "0type_woodSemi": 0.263688,
  "0type_steelSlopOne": 0.263688,
  "0type_steelSlopTwo": 0.263688,
  "0type_solidSlopOne": 0.37744,
  "0type_solidTwoSlop": 0.7774,
};

export const modelCabinetWidth: { [key: string]: number } = {
  default: 0.29881,
  "0type_steelOne": 0.29881,
  "0type_steelTwo": 0.598,
  "0type_solidOne": 0.40001,
  "0type_solidTwo": 0.79996,
  "0type_woodOne": 0.3,
  // "0type_woodOne": 0.295,
  "0type_woodSemi": 0.3,
  "0type_steelSlopOne": 0.298,
  "0type_steelSlopTwo": 0.598,
  "0type_solidSlopOne": 0.40001,
  "0type_solidTwoSlop": 0.79996,
}; //calculated by scale

export const modelCabinetDepth: { [key: string]: number } = {
  default: 0.47919,
  "0type_steelOne": 0.47919,
  "0type_steelTwo": 0.478495,
  "0type_solidOne": 0.4672,
  "0type_solidTwo": 0.486386,
  "0type_woodOne": 0.508,
  "0type_woodSemi": 0.505,
  "0type_steelSlopOne": 0.47919,
  "0type_steelSlopTwo": 0.478495,
  "0type_solidSlopOne": 0.4672,
  "0type_solidTwoSlop": 0.486386,
};

// export const solidLeftPanelSpace: { [key: string]: number } = {
//   default: 0,
//   "0type_steelOne": 0,
//   "0type_steelTwo": 0,
//   "0type_solidOne": 0.0055,
//   "0type_solidTwo": 0.005,
//   "0type_woodOne": 0.005,
// };

export const doorRefXPosition: { [key: string]: number } = {
  "0type_steelOne": 0.5,
  "0type_steelTwo": 0.5,
  "0type_solidOne": 0.5,
  "0type_solidTwo": 0.1,
  "0type_woodOne": 0.5,
  "0type_woodSemi": 0.5,
  "0type_steelSlopOne": 0.5,
  "0type_steelSlopTwo": 0.5,
  "0type_solidSlopOne": 0.5,
  "0type_solidTwoSlop": 0.1,
};

export const doorRefZPosition: { [key: string]: number } = {
  "0type_steelOne": 1.5,
  "0type_steelTwo": 0.5,
  "0type_solidOne": 1.5,
  "0type_solidTwo": 0.5,
  "0type_woodOne": 1.5,
  "0type_woodSemi": 1.5,
  "0type_steelSlopOne": 1.5,
  "0type_steelSlopTwo": 1.5,
  "0type_solidSlopOne": 1.5,
  "0type_solidTwoSlop": 0.5,
};

export const doorLeftValue: { [key: string]: number } = {
  "0type_steelOne": 0.1,
  "0type_steelTwo": 0.7,
  "0type_solidOne": 0.1,
  "0type_solidTwo": 0.1,
  "0type_woodOne": 0.1,
  "0type_woodSemi": 0.1,
  "0type_steelSlopOne": 0.1,
  "0type_steelSlopTwo": 0.7,
  "0type_solidTwoSlop": 0.1,
};

export const modelRightPanelWidth: { [key: string]: number } = {
  "0type_steelOne": 0.02583, // we are using to get top panel scale, position
  "0type_steelTwo": 0.024,
  "0type_solidOne": 0.0118, // we are using to get right panel position
  "0type_solidTwo": 0.0100444,
  "0type_woodOne": 0.019089,
  "0type_woodSemi": 0.019089,
  "0type_steelSlopOne": 0.02583,
  "0type_steelSlopTwo": 0.024,
  "0type_solidSlopOne": 0.0118,
  "0type_solidTwoSlop": 0.0100444,
};

export const steelCabinetTopPanelSpace = 0.00205; // we have space between right panel and top panel on the steel cabinet

export const steelCabinetTopPanelPositionVariable: { [key: string]: number } = {
  "0type_steelOne": 2.85,
  "0type_steelTwo": 2.77,
  "0type_steelSlopOne": 2.77,
  "0type_steelSlopTwo": 2.77,
};

export const leftPanelHoleAdditionalPosition: { [key: string]: number } = {
  "0type_steelOne": 0.015,
  "0type_steelTwo": 0.015,
  "0type_solidOne": 0.015,
  "0type_solidTwo": 0.015,
  "0type_woodOne": 0.03,
  "0type_woodSemi": 0.03,
  "0type_steelSlopOne": 0.015,
  "0type_steelSlopTwo": 0.015,
  "0type_solidSlopOne": 0.015,
  "0type_solidTwoSlop": 0.015,
};
// we have a little space according to cabinet and we should add value, correct.

export const startSidePanelPosition: { [key: string]: number } = {
  "0type_steelOne": -0.008,
  "0type_steelTwo": -0.008,
  "0type_solidOne": -0.03,
  "0type_solidTwo": -0.008,
  "0type_woodOne": -0.008,
  "0type_woodSemi": -0.008,
};
