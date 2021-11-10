import { WebMapTileServiceImageryProvider } from "cesium";

const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
const tokens = ['951abadef14eca5017b16c87cb8595f3'] // 天地图token，需要去天地图官网申请，有次数限制
const tiandituTk = tokens[Date.now() % 4]
const tdtUrl = 'https://t{s}.tianditu.gov.cn';

// 天地图卫星影像
export const tdtSat = new WebMapTileServiceImageryProvider({
	//影像底图
	url: tdtUrl + "/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + tiandituTk,
	layer: "tdtImgLayer",
	style: "default",
	format: "image/jpeg",
	tileMatrixSetID: "GoogleMapsCompatible",
	subdomains,
	maximumLevel: 18
});

// 天地图标注
export const tdtRoad = new WebMapTileServiceImageryProvider({
	//影像注记
	url: tdtUrl + "/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + tiandituTk,
	layer: "tdtCiaLayer",
	style: "default",
	format: "image/jpeg",
	tileMatrixSetID: "GoogleMapsCompatible",
	subdomains,
	maximumLevel: 18
});

// 国界
// const country = new WebMapTileServiceImageryProvider({
// 	url: tdtUrl + '/ibo_w/wmts?tk=' + tiandituTk,
// 	subdomains: subdomains,
// 	maximumLevel: 10,
// 	layer: "tdtIboLayer",
// 	style: "default",
// 	format: "image/jpeg",
// 	tileMatrixSetID: "GoogleMapsCompatible",
// })

// 天地图三维地形
const terrainUrls = subdomains.map(subdomain => `${tdtUrl.replace('{s}', subdomain)}/mapservice/swdx?tk=${tiandituTk}`)
export const tdtTerrainProvider = new (window as any).Cesium.GeoTerrainProvider({
	urls: terrainUrls
})