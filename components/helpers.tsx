import Color from 'color';
import { Permissions, Location } from 'expo';
import { Weather, HSV, RGB } from './formats';

const colorSpace: Array<{ name: string; color: { r: number; g: number; b: number } }> = [
  { name: 'black', color: { r: 0, g: 0, b: 0 } },
  { name: 'gray', color: { r: 128, g: 128, b: 128 } },
  { name: 'white', color: { r: 255, g: 255, b: 255 } },
  { name: 'maroon', color: { r: 128, g: 0, b: 0 } },
  { name: 'red', color: { r: 230, g: 25, b: 75 } },
  { name: 'pink', color: { r: 250, g: 190, b: 190 } },
  { name: 'brown', color: { r: 170, g: 110, b: 40 } },
  { name: 'orange', color: { r: 245, g: 130, b: 48 } },
  { name: 'apricot', color: { r: 255, g: 215, b: 180 } },
  { name: 'olive', color: { r: 128, g: 128, b: 0 } },
  { name: 'yellow', color: { r: 255, g: 255, b: 25 } },
  { name: 'beige', color: { r: 255, g: 250, b: 200 } },
  { name: 'lime', color: { r: 210, g: 245, b: 60 } },
  { name: 'green', color: { r: 60, g: 180, b: 75 } },
  { name: 'mint', color: { r: 170, g: 255, b: 195 } },
  { name: 'teal', color: { r: 0, g: 128, b: 128 } },
  { name: 'cyan', color: { r: 70, g: 240, b: 240 } },
  { name: 'navy', color: { r: 0, g: 0, b: 128 } },
  { name: 'blue', color: { r: 0, g: 130, b: 200 } },
  { name: 'purple', color: { r: 145, g: 30, b: 180 } },
  { name: 'lavender', color: { r: 230, g: 190, b: 255 } },
  { name: 'magenta', color: { r: 240, g: 50, b: 230 } }
  // {name: "", color: {r: , g: , b: }},
];

export function colorDistance(color1: string, color2: string) {
  let color1obj = Color(color1).object();
  let color2obj = Color(color2).object();
  return Math.sqrt(
    Math.pow(color1obj.r - color2obj.r, 2) +
    Math.pow(color1obj.g - color2obj.g, 2) +
    Math.pow(color1obj.b - color2obj.b, 2)
  );
}

export function roundColor(color: string): string {
  let colorRGB = Color(color).object();

  let smallestIndex = 0;
  let smallest = 10000;
  let index = 0;
  for (let color of colorSpace) {
    let distance = Math.sqrt(
      Math.pow(colorRGB.r - color.color.r, 2) +
      Math.pow(colorRGB.g - color.color.g, 2) +
      Math.pow(colorRGB.b - color.color.b, 2)
    );
    if (distance < smallest) {
      smallest = distance;
      smallestIndex = index;
    }
    index++;
  }
  return colorSpace[smallestIndex].name;
}

export function roundColors(colors: string[]) {
  let allColors = '';
  let index = 0;
  for (let color of colors) {
    if (index === 0) {
      allColors += roundColor(color);
    } else {
      if (index === colors.length - 1) {
        allColors = allColors + " and " + roundColor(color);
      } else {
        allColors = allColors + ', ' + roundColor(color);
      }
    }
    index++;
  }
  return allColors;
}

export async function getWeather() : Promise<Weather> {
  let permission = await Permissions.getAsync(Permissions.LOCATION);
  if (permission.status === "undetermined") {
    await Permissions.askAsync("location");
    //to do : this
    //asked now try again
    let newPermissionState = await Permissions.getAsync(Permissions.LOCATION);
    if (newPermissionState.status === "denied") {
      return { working: false };
    } else {
      return fetchWeather();
    }
  } else if (permission.status === "granted") {
    return fetchWeather();
  } else {
    return { working: false };
  }
}

async function fetchWeather() : Promise<Weather> {
  try {
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: false });
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&APPID=f5d6ef4e8483e37868b945b9c390e6cb`, { method: "GET" });
    let json = await response.json();
    let temp = json["main"]["temp"];
    let isUS = json["sys"]["country"] === "US"; 
    let city = json["name"];
    let f = (temp - 273.15) * 9/5 + 32;
    let c = temp - 273.15;
    let tempString;
    if(f > 75){
      tempString = "hot";
    } else if(f > 65){
      tempString = "warm";
    } else if(f > 50){
      tempString = "chilly";
    } else {
      tempString = "cold";
    }
    return {working: true, f: f, c: c, isUS: isUS, city: city, temp: tempString};
  } catch (error) {
    alert("there was an error getting the weather." + error)
    return { working: false };
  }
}

export function clipRange(value: number, initialRange: number, finalRange: number){
  return finalRange * value / initialRange;
}


export function getCompliment(color: {r: number, b: number, g: number} | string, shift: number) {

  let hsv = Color(color).hsv().object();
  hsv.h = HueShift(hsv.h, shift);
  let compliment = Color(hsv);
  return compliment.hex();
}


function HueShift(h: number,s: number) { 
  h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; 
}

export function MiddleColorHSV(color1: any, color2: any){
  let color1hsv: HSV = Color(color1).hsv().object() as any;
  let color2hsv: HSV = Color(color2).hsv().object() as any;
  let hDist = HueDistance(color1hsv, color2hsv) / 2;
  let sDist = SaturationDistance(color1hsv, color2hsv) / 2;
  let vDist = ValueDistance(color1hsv, color2hsv) / 2;
  let h = color1hsv.h >= color2hsv.h ? color1hsv.h - hDist :  color2hsv.h - hDist;
  let s = color1hsv.s >= color2hsv.s ? color1hsv.s - sDist :  color2hsv.s - sDist;
  let v = color1hsv.v >= color2hsv.v ? color1hsv.v - vDist :  color2hsv.v - vDist;
  console.log("middle", {h: h, s:s, v:v})
  return Color({h: h, s: s, v: v}).hex();
}

export function LeftColorHSV(color1: any, color2: any) {
  let color1hsv: HSV = Color(color1).hsv().object() as any;
  let color2hsv: HSV = Color(color2).hsv().object() as any;
  let hDist = HueDistance(color1hsv, color2hsv) / 2;
  let sDist = SaturationDistance(color1hsv, color2hsv) / 2;
  let vDist = ValueDistance(color1hsv, color2hsv) / 2;

  let h = color1hsv.h >= color2hsv.h ? color1hsv.h + hDist :  color2hsv.h + hDist;
  let s = color1hsv.s >= color2hsv.s ? color1hsv.s + sDist :  color2hsv.s + sDist;
  let v = color1hsv.v >= color2hsv.v ? color1hsv.v + vDist :  color2hsv.v + vDist;
  console.log("left", {h: h, s:s, v:v})

  return Color({h: h, s: s, v: v}).hex();
}

export function RightColorHSV(color1: any, color2: any) {
  let color1hsv: HSV = Color(color1).hsv().object() as any;
  let color2hsv: HSV = Color(color2).hsv().object() as any;
  let hDist = HueDistance(color1hsv, color2hsv) / 2;
  let sDist = SaturationDistance(color1hsv, color2hsv) / 2;
  let vDist = ValueDistance(color1hsv, color2hsv) / 2;

  let h = color1hsv.h <= color2hsv.h ? color1hsv.h - hDist :  color2hsv.h - hDist;
  let s = color1hsv.s <= color2hsv.s ? color1hsv.s - sDist :  color2hsv.s - sDist;
  let v = color1hsv.v <= color2hsv.v ? color1hsv.v - vDist :  color2hsv.v - vDist;
  console.log("right", {h: h, s:s, v:v})

  return Color({h: h, s: s, v: v}).hex();
}

export function leftHueHSV(color1: any, color2: any) {
  let color1hsv: HSV = Color(color1).hsv().object() as any;
  let color2hsv: HSV = Color(color2).hsv().object() as any;
  let hDist = HueDistance(color1hsv, color2hsv) / 2;

  color1hsv.h += hDist;
  while (color1hsv.h>=360.0) color1hsv.h-=360.0; while (color1hsv.h<0.0) color1hsv.h+=360.0; 
  
  return Color(color1hsv).hex();
}
export function rightHueHSV(color1: any, color2: any) {
  let color1hsv: HSV = Color(color1).hsv().object() as any;
  let color2hsv: HSV = Color(color2).hsv().object() as any;
  let hDist = HueDistance(color1hsv, color2hsv) / 2;

  color2hsv.h -= hDist;
  while (color2hsv.h>=360.0) color2hsv.h-=360.0; while (color2hsv.h<0.0) color2hsv.h+=360.0; 
  
  return Color(color2hsv).hex();
}

export function HueDistance(color1: HSV, color2: HSV) {
  return Math.abs(color1.h - color2.h);
}

function SaturationDistance(color1: HSV, color2: HSV) {
  return Math.abs(color1.s - color2.s)
}

function ValueDistance(color1: HSV, color2: HSV) {
  return Math.abs(color1.v - color2.v)
}