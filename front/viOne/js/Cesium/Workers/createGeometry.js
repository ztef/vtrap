/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.109
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as p}from"./chunk-GGX7KO55.js";
import{a as y}from"./chunk-ITS5OBIO.js";
import"./chunk-NHJ7LQMB.js";
import"./chunk-GH2M3QEY.js";
import"./chunk-YZMLQP2E.js";
import"./chunk-BSOA334C.js";
import"./chunk-YYMHH3T4.js";
import"./chunk-ATQXFTWF.js";
import"./chunk-67OQHZOZ.js";
import"./chunk-FUN3J34G.js";
import"./chunk-A4RD4IQP.js";
import"./chunk-NNIY7VTE.js";
import"./chunk-NX64RCXJ.js";
import"./chunk-5EDTRNG5.js";import"./chunk-IO6LETQ6.js";import"./chunk-C6Y3PRDH.js";import"./chunk-LI57NJAL.js";import"./chunk-IBAO62UG.js";import"./chunk-3NARV6MR.js";import"./chunk-P44SUSQU.js";import"./chunk-FUATUYJ3.js";import{a as f,b as m,e as i}from"./chunk-ODUTJJQ5.js";var b=m({"./combineGeometry.js":()=>import("./combineGeometry.js"),"./createBoxGeometry.js":()=>import("./createBoxGeometry.js"),"./createBoxOutlineGeometry.js":()=>import("./createBoxOutlineGeometry.js"),"./createCircleGeometry.js":()=>import("./createCircleGeometry.js"),"./createCircleOutlineGeometry.js":()=>import("./createCircleOutlineGeometry.js"),"./createCoplanarPolygonGeometry.js":()=>import("./createCoplanarPolygonGeometry.js"),"./createCoplanarPolygonOutlineGeometry.js":()=>import("./createCoplanarPolygonOutlineGeometry.js"),"./createCorridorGeometry.js":()=>import("./createCorridorGeometry.js"),"./createCorridorOutlineGeometry.js":()=>import("./createCorridorOutlineGeometry.js"),"./createCylinderGeometry.js":()=>import("./createCylinderGeometry.js"),"./createCylinderOutlineGeometry.js":()=>import("./createCylinderOutlineGeometry.js"),"./createEllipseGeometry.js":()=>import("./createEllipseGeometry.js"),"./createEllipseOutlineGeometry.js":()=>import("./createEllipseOutlineGeometry.js"),"./createEllipsoidGeometry.js":()=>import("./createEllipsoidGeometry.js"),"./createEllipsoidOutlineGeometry.js":()=>import("./createEllipsoidOutlineGeometry.js"),"./createFrustumGeometry.js":()=>import("./createFrustumGeometry.js"),"./createFrustumOutlineGeometry.js":()=>import("./createFrustumOutlineGeometry.js"),"./createGeometry.js":()=>import("./createGeometry.js"),"./createGroundPolylineGeometry.js":()=>import("./createGroundPolylineGeometry.js"),"./createPlaneGeometry.js":()=>import("./createPlaneGeometry.js"),"./createPlaneOutlineGeometry.js":()=>import("./createPlaneOutlineGeometry.js"),"./createPolygonGeometry.js":()=>import("./createPolygonGeometry.js"),"./createPolygonOutlineGeometry.js":()=>import("./createPolygonOutlineGeometry.js"),"./createPolylineGeometry.js":()=>import("./createPolylineGeometry.js"),"./createPolylineVolumeGeometry.js":()=>import("./createPolylineVolumeGeometry.js"),"./createPolylineVolumeOutlineGeometry.js":()=>import("./createPolylineVolumeOutlineGeometry.js"),"./createRectangleGeometry.js":()=>import("./createRectangleGeometry.js"),"./createRectangleOutlineGeometry.js":()=>import("./createRectangleOutlineGeometry.js"),"./createSimplePolylineGeometry.js":()=>import("./createSimplePolylineGeometry.js"),"./createSphereGeometry.js":()=>import("./createSphereGeometry.js"),"./createSphereOutlineGeometry.js":()=>import("./createSphereOutlineGeometry.js"),"./createTaskProcessorWorker.js":()=>import("./createTaskProcessorWorker.js"),"./createVectorTileClampedPolylines.js":()=>import("./createVectorTileClampedPolylines.js"),"./createVectorTileGeometries.js":()=>import("./createVectorTileGeometries.js"),"./createVectorTilePoints.js":()=>import("./createVectorTilePoints.js"),"./createVectorTilePolygons.js":()=>import("./createVectorTilePolygons.js"),"./createVectorTilePolylines.js":()=>import("./createVectorTilePolylines.js"),"./createVerticesFromGoogleEarthEnterpriseBuffer.js":()=>import("./createVerticesFromGoogleEarthEnterpriseBuffer.js"),"./createVerticesFromHeightmap.js":()=>import("./createVerticesFromHeightmap.js"),"./createVerticesFromQuantizedTerrainMesh.js":()=>import("./createVerticesFromQuantizedTerrainMesh.js"),"./createWallGeometry.js":()=>import("./createWallGeometry.js"),"./createWallOutlineGeometry.js":()=>import("./createWallOutlineGeometry.js"),"./decodeDraco.js":()=>import("./decodeDraco.js"),"./decodeGoogleEarthEnterprisePacket.js":()=>import("./decodeGoogleEarthEnterprisePacket.js"),"./decodeI3S.js":()=>import("./decodeI3S.js"),"./transcodeKTX2.js":()=>import("./transcodeKTX2.js"),"./transferTypedArrayTest.js":()=>import("./transferTypedArrayTest.js"),"./upsampleQuantizedTerrainMesh.js":()=>import("./upsampleQuantizedTerrainMesh.js")});var c={};async function k(r){let e=c[r];return i(e)||(typeof exports=="object"?c[e]=e=f(`Workers/${r}`):(e=(await b(`./${r}.js`)).default,c[e]=e)),e}async function g(r,e){let o=r.subTasks,l=o.length,s=new Array(l);for(let t=0;t<l;t++){let n=o[t],u=n.geometry,a=n.moduleName;i(a)?s[t]=k(a).then(d=>d(u,n.offset)):s[t]=u}return Promise.all(s).then(function(t){return p.packCreateGeometryResults(t,e)})}var C=y(g);export{C as default};
