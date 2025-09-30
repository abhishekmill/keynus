import * as THREE from "three";

// Types for GLTF ===========================================================================================
declare module "@react-three/fiber" {
  export interface ObjectMap {
    nodes: {
      [name: string]: THREE.Object3D & { geometry: THREE.BufferGeometry };
    };
    materials: {
      [name: string]: THREE.Material;
    };
  }
}

export interface INodes {
  [name: string]: THREE.Object3D<THREE.Object3DEventMap> & {
    geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
  };
}

// Types for store ==========================================================================================
export interface ISelectionControl {
  isGroupSelection: boolean;
  selectionMode: "drag" | "click";
  selectionType: "cabinet" | "door";
}

export interface ICameraControl {
  position: [number, number, number];
  near: number;
  fov: number;
}

// Types for API response ===================================================================================
export interface IDoor {
  type: string;
  texture: string;
  isOpened: boolean;
  height?: number;
  separateDoors: {
    isOpened: boolean;
    texture: string;
  }[];
  accessories: {
    smarty?: IAccessory;
    payment?: IAccessory;
    qrReader?: IAccessory;
  };
}

export interface IAccessory {
  id: string;
  type: string;
  url: string;
  columnPosition: number; //column lockerwall order
  position: number; //accessory order for sort
}

export interface ICabinet {
  texture: string;
}

export interface IMaterialList {
  name: string;
  colorCode: string;
  textureUrl: string;
}

export interface ILockerWallItem {
  [key: string]: any;
  position: number;
  width: number;
  modalWidth?: number;
  height: number;
  depth: number;
  column?: number;
  cabinet: ICabinet;
  articleId: string;
  price: number;
  isCustom: boolean;
  cabinetUrl: string;
  hasCabinetStandardAttribute?: boolean;
  sidePanel?: {
    id?: string;
    url: string;
    position: "start" | "end" | "unknown";
    price?: number;
    articleName?: string;
  };
  doors: {
    [key: string]: IDoor;
  };
}

export interface ILockCategory {
  id: string;
  name: string;
}

export interface ILockType {
  id: string;
  name: string;
}

export interface IUpdateLockerItem {
  position?: number;
  cabinet?: ICabinet;
  doors?: {
    [key: string]: IDoor;
  };
}

export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  forceChangePassword: boolean;
  isBlocked: boolean;
  isCustomerAd: boolean;
  language: "nl" | "en";
  provider: string;
  subscriptionId: number;
  tenants: { id?: string; name?: string }[];
  waysOfIdentification: string[];
}

export interface IProject {
  id: string;
  partnerId: string;
  partnerName: string;
  projectName: string;
  projectNumber: string;
  isDiscountPercentageEnable: boolean;
  customerName: string;
  address: {
    address1?: string;
    address2?: string;
    street?: string;
    houseNumber?: string;
    city?: string;
    zip?: string;
    country: number;
  };
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  projectDetails?: string;
  branch?: string;
  projectStatus: string;
  expectedDeliveryDate?: Date;
  salesPersonEmail: string;
  salesPersonName: string;
}

export interface IPdfFileData {
  templateId: string;
  header1: string;
  paragraph1_1: string;
  paragraph1_2: string;
  paragraph1_3: string;
  imageURL1_1: string;
  header2: string;
  paragraph2_1: string;
}

export interface ICountry {
  id: number;
  name: string;
  vat: number;
}

export interface IPartner {
  id: string;
  name: string;
}

export interface ILockerwall {
  id: string;
  keyniusProjectId: string;
  lockerWallName: string;
  floor: string;
  lockType: string;
  notes: string;
  lockCategoryId?: string;
  lockTypeId?: string;
  articles?: ILockerwallArticle[];
  configuration3DJson: string;
  imageURL: string;
}

export interface ILockerwallArticle {
  amount: number;
  accessoryType: string;
  articleId: string;
  articleName: string;
  articleType: string;
  discount: number;
  id: string;
  pricePerUnit: number;
}

export interface IProductLineCabinet {
  articleId: string;
  articleName: string;
  height: string;
  width: string;
  depth: string;
  doors: number;
  mainImage: string;
  categoryName: string[];
}

export interface IArticleConfigureLockerWall {
  id: string;
  articleName: string;
  customArticleName: string;
  articleNumber: string;
  articleImage: string;
  price?: number;
  isDefaultCabinet: boolean;
  articleAllAttributeValuesResult: {
    height: string;
    width: string;
    depth: string;
    door: string;
    columns: string;
    compartments: string;
  };
}

export interface ILockerWallSelector {
  id: string;
  categoryName: string;
  articleListToConfigureLockerWallResult: IArticleConfigureLockerWall[];
}

export interface ILockerWallSelectorList {
  result: {
    articleCategories: ILockerWallSelector[];
    totalCount: number;
  };
  isSuccess: boolean;
  message: string;
  errors: any;
}

export interface IFilterType {
  name: string;
  value: number;
  displayName: string;
}

export interface IArticleFilter {
  [key: string]: IFilterType[];
  branch: IFilterType[];
  material: IFilterType[];
  usecase: IFilterType[];
}

export interface IArticleList {
  result: {
    id: string;
    articleName: string;
    articleImage: string;
  }[];
  totalCount: 0;
}

export interface IArticleAttribute {
  id: string;
  attributeName: string;
  attributeId: string;
  attributeAffect: string;
  applicableTo: string;
  attributeValues: any;
}

export interface IArticleColors {
  id?: string;
  name: string;
  colorCode: string;
  textureUrl: string;
  colorType?: string;
}

export interface IArticle {
  articleId: string;
  buyOutPrice: number;
  articlePrice: {
    buyOutPrice: number;
    sellOutPrice: number;
  };
  id: string;
  articleName: string;
  customArticleName: string;

  articleNumber: string;
  renderCabinetBaseUrl: string;
  primaryImageUrl?: string;
  descriptionFull: string;
  customShortDescription: string;
  descriptionShort: string;
  customFullDescription: string;
  colors: IArticleColors[];
  keyniusPIMArticleAttributeResults: IArticleAttribute[];
  lockerWallName?: string;
  price: number;
  datasheets: string[];
  certificates: string[];
  currency: ICurrency;
}

export interface IGetLockerWall {
  accessories?: IAccessories[];
  configurations?: IConfiguration[];
  keyniusProjectId: string;
  floor: string;
  lockerWallName: string;
  lockCategoryId: string;
  lockTypeId: string;
  notes: string;
  configuration3DJson: string;
  colors: IArticleColors[];
  renderCabinetBaseUrl: string;
  id: string;
  currency: { name: string; symbol: string; format: string; code: string };
}

export interface IConfiguration {
  keyniusProjectLockerwall: {
    configuration3DJson: string;
  };
  keyniusPIMArticleId: string;
  keyniusPIMArticle: {
    articleNumber: string;
    articleName: string;
    descriptionShort: string;
    descriptionFull: string;
    price: number;
    renderCabinetBaseUrl: string;
    dimension: {
      depth: string;
      width: string;
      height: string;
    };
    cabinet: {
      columns: string;
      compartments: string;
    };
    colors: IMaterialList[];
    id: string;
  };
  isCustom: boolean;
  amount: number;
  pricePerUnit: number;
  discount: number;
  columns: number;
  compartment: number;
  cabinetColorId: string;
  cabinetColor: string;
  doorType: string;
  doorColorId: string;
  doorColor: string;
  id: string;
}

export interface IKeyniusPIMArticle {
  articleNumber: string;
  articleName: string;
  descriptionFull: string;
  descriptionShort: string;
  price?: number;
  renderCabinetBaseUrl?: string;
  dimension?: {
    depth: string;
    width: string;
    height: string;
  };
  cabinet?: {
    columns: string;
    compartments: string;
  };
  colors?: IMaterialList[];
  sidePanelReferences?: ISidePanelType[];
  cabinetRoofReferences?: any;
  id?: string;
  smartyReferences?: IAccessoriesReferenceType[];
  paymentTypeReferences?: IAccessoriesReferenceType[];
  qrReaderReferences?: IAccessoriesReferenceType[];
}

export interface IArticleNote {
  id: string;
  name: string;
  notes: string;
  addOnType?: string;
  articleType?: string;
  lockerWallId?: string;
}

export interface IAccessoriesReferenceType {
  articleId: string;
  imageUrl: string;
  imageUrl3D: string;
  price: number;
  name: string;
}

export interface ISidePanelType {
  articleId: string;
  id: string;
  imageUrL?: string;
  imageUrl3D: string;
  name: string;
  price: number;
}

export interface IAccessories {
  keyniusPIMArticleId: string;
  articleName?: string;
  price?: number;
  quantity: number;
  url?: string;
}

export interface IkeyniusPIMArticle {
  articleNumber: string;
  articleName: string;
  descriptionFull: string;
  descriptionShort: string;
  hsCode: string;
  countryId: number;
  weight: number;
  gauranteeYears: number;
  articleTypeId: string;
  buyingEntityId: string;
  keyniusPIMAreticleSEOs: any;
  keyniusPIMArticleImages: [
    {
      id: string;
      keyniusArticleId: string;
      imageType: string;
      imageURL: string;
    },
  ];
  keyniusPIMArticleAttributeResults: {
    id: string;
    attributeName: string;
    attributeId: string;
    attributeAffect: string;
    applicableTo: string;
    attributeValues: any;
  }[];
}

export interface IkeyniusPIMArticleColor {
  name: string;
  code: string;
  manufacturerName: string;
  manufacturerCode: string;
  textureUrl: string;
  id: string;
}

export interface ICurrency {
  name: string;
  symbol: string;
  format: string;
  code: string;
}

export interface IProjectAddOn {
  id: string;
  addOnType: string;
  keyniusProjectId: string;
  keyniusPIMArticleId: string;
  keyniusPIMArticle: IkeyniusPIMArticle;
  amount?: number;
  quantity?: number;
  pricePerUnit: number;
  discount: number;
  KeyniusProject: IProject;
  subscriptionCycle?: string;
  keyniusPIMArticleColor?: IkeyniusPIMArticleColor;
}

export interface IProjectData {
  id: string;
  partnerId: string;
  salesPersonEmail: string;
  partnerName: string;
  projectName: string;
  projectNumber: string;
  customerName: string;
  address: {
    address1: string;
    address2: string;
    street: string;
    houseNumber: string;
    city: string;
    zip: string;
    country: number;
  };
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  expectedDeliveryDate: string;
  projectDetails: string;
  branch: string;
  projectStatus: string;
  keyniusProjectLockerWalls: ILockerwall[];
  keyniusProjectAddOns: IProjectAddOn[];
  currancy: ICurrency;
  header1: string;
  paragraph1_1: string;
  paragraph1_2: string;
  paragraph1_3: string;
  imageURL1_1: string;
  header2: string;
  paragraph2_1: string;
  isDiscountPercentageEnable: boolean;
}

export interface IProjectTemplateList {
  id: string;
  name: string;
  documentType: string;
}

export interface ISubscription {
  id?: string;
  articleName?: string;
  article: string;
  lockers: number;
  pricePerLocker: number;
  discount: number;
  nettoPrice?: number;
  subscriptionCycle?: string;
  subscriptionCycleLabel?: string;
  totalPrice?: number;
}

export interface ISubscriptionArticle {
  id: string;
  articleName: string;
  articleNumber: string;
  articleSubscriptionResult: {
    id: string;
    cycle: string;
    price: number;
  }[];
}

export interface IAccessoriesType {
  smarty: number;
  payment: number;
  qrReader: number;
}

export interface ICompartmentPosition {
  position: number;
  isOpened: boolean;
}

export interface INumbering {
  articleName: string;
  articleNumber: string;
  id: string;
}

export type ISideAccessoriesType = "smarty" | "payment" | "qrReader";
export type IModelType = "default" | "0type_steelOne" | "0type_steelTwo" | "0type_solidOne" | "0type_solidTwo";
