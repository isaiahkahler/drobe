import * as React from 'react';
import { Dimensions } from 'react-native';

import {
  Svg,
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';
import { access } from 'fs';

const { width, height} = Dimensions.get("window");

interface IconProps {
  icon: string;//"create" | "library" | "add" | "stats" | "settings";
  isAccent?: boolean;
  multiplier?: number;
}
interface IconState {}

export class Icon extends React.Component<IconProps, IconState>{
  getIcon() {
    let icon;
    switch(this.props.icon){
      case "Create": icon = <CreateIcon accent={this.props.isAccent}/>;
      break;
      case "Library": icon = <LibraryIcon accent={this.props.isAccent} />
      break;
      case "Add": icon = <AddIcon accent={this.props.isAccent} />
      break;
      case "Stats": icon = <StatsIcon accent={this.props.isAccent} />
      break;
      case "Settings": icon = <SettingsIcon accent={this.props.isAccent} />
      break;
      case "Lightbulb": icon = <Lightbulb multiplier={this.props.multiplier} />;
      break;
      case "ManualHand": icon = <ManualHand multiplier={this.props.multiplier} />;
      break;
      case "Profile": icon = <Profile accent={this.props.isAccent} />;
      break;
      default: icon = <CreateIcon accent={this.props.isAccent} />
    }
    return icon;
  }
  
  render() {
    
    return(this.getIcon());
  }

}

function AddIcon(props: {accent?: boolean}) {
  if(props.accent){

    return (
      <Svg height="22.092" width="30" viewBox="452.004 97.154 43.016 31.677"> {/*height="22.092" width="30"*/}
        <G>
          <Circle x="473.51173973921584" y="114.4094516023211" fill="none" r="5.6692913385826955" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Path d=" M 456.504 104.488 L 466.425 104.488 L 466.425 101.654 L 480.598 101.654 L 480.598 104.488 L 490.52 104.488 L 490.52 124.331 L 456.504 124.331 L 456.504 104.488 Z " fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Circle x="485.5980256752562" y="109.4488216810611" fill="none" r="0.708661417322844" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="2"/>
        </G>
      </Svg>
    );
  } 

    return (
      <Svg height="22.092" width="30" viewBox="452.004 97.154 43.016 31.677">
        <G>
          <Circle x="473.51173973921584" y="114.4094516023211" fill="none" r="5.6692913385826955" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
          <Path d=" M 456.504 104.488 L 466.425 104.488 L 466.425 101.654 L 480.598 101.654 L 480.598 104.488 L 490.52 104.488 L 490.52 124.331 L 456.504 124.331 L 456.504 104.488 Z " fill="none" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
          <Circle x="485.5980256752562" y="109.4488216810611" fill="none" r="0.708661417322844" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="2"/>
        </G>
      </Svg>
    );
  
}

function CreateIcon(props: {accent?: boolean}) {
  if(props.accent){
    return (
      
      <Svg height="30" width="36.0243" viewBox="358.069 91.484 51.654 43.016"> {/*height="30" width="36.0243" */}
        <G>
          <Path d=" M 395.246 96.029 L 395.246 95.984 L 390.59 95.984 C 389.617 97.635 386.991 98.819 383.908 98.819 C 380.825 98.819 378.199 97.635 377.225 95.984 L 372.569 95.984 L 372.569 96.006 L 362.569 106.006 L 368.582 112.019 L 372.569 108.032 L 372.569 130 L 395.246 130 L 395.246 108.056 L 399.21 112.019 L 405.223 106.006 L 395.246 96.029 Z " fill="none" fillRule="evenodd" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Line stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3" x1="383.896" x2="383.896" y1="107.715" y2="119.053"/>
          <Line stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3" x1="378.227" x2="389.565" y1="113.384" y2="113.384"/>
        </G>
      </Svg>
    );

  } 

    return (
      
      <Svg height="30" width="36.0243" viewBox="358.069 91.484 51.654 43.016">
        <G>
          <Path d=" M 395.246 96.029 L 395.246 95.984 L 390.59 95.984 C 389.617 97.635 386.991 98.819 383.908 98.819 C 380.825 98.819 378.199 97.635 377.225 95.984 L 372.569 95.984 L 372.569 96.006 L 362.569 106.006 L 368.582 112.019 L 372.569 108.032 L 372.569 130 L 395.246 130 L 395.246 108.056 L 399.21 112.019 L 405.223 106.006 L 395.246 96.029 Z " fill="none" fillRule="evenodd" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
          <Line stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3" x1="383.896" x2="383.896" y1="107.715" y2="119.053"/>
          <Line stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3" x1="378.227" x2="389.565" y1="113.384" y2="113.384"/>
        </G>
      </Svg>
    );
  
}

function LibraryIcon(props: {accent?: boolean}) {
  if(props.accent){
    return (
      <Svg height="30" width="21.4992" viewBox="414.893 91.484 28.677 40.016">
        <G>
          <Rect height="34.016" width="22.677" fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3" transform="matrix(1,0,0,1,0,0)" x="419.393" y="95.984"/>
          <Circle x="424.81420538094324" y="112.99212598425194" fill="rgb(235,235,235)" r="1.417322834645688" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
        </G>
      </Svg>
    );

  } 

    return (
      <Svg height="30" width="21.4992" viewBox="414.893 91.484 28.677 40.016"> 
        <G>
          <Rect height="34.016" width="22.677" fill="none" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3" transform="matrix(1,0,0,1,0,0)" x="419.393" y="95.984"/>
          <Circle x="424.81420538094324" y="112.99212598425194" fill="rgb(235,235,235)" r="1.417322834645688" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
        </G>
      </Svg>
    );
  
}

function StatsIcon(props: {accent?: boolean}) {
  if(props.accent){

    return (
      <Svg height="30" width="26.0457" viewBox="499.732 89.984 37.346 43.016">
        <G>
          <Path d=" M 507.232 95.984 L 507.232 130 L 535.578 130" fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Path d=" M 508.988 129.452 L 515.286 112.893 L 523.713 116.603 L 528.473 102.349" fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Path d=" M 521.405 103.539 L 529.112 99.945 L 532.706 107.652" fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
        </G>
      </Svg>
    );
  } 
  return (
    <Svg height="30" width="26.0457" viewBox="499.732 89.984 37.346 43.016">
    	<G>
    		<Path d=" M 507.232 95.984 L 507.232 130 L 535.578 130" fill="none" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    		<Path d=" M 508.988 129.452 L 515.286 112.893 L 523.713 116.603 L 528.473 102.349" fill="none" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    		<Path d=" M 521.405 103.539 L 529.112 99.945 L 532.706 107.652" fill="none" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    	</G>
    </Svg>
  );
}


function SettingsIcon(props: {accent?: boolean}) {
  if(props.accent){

    return (
      <Svg height="30" width="30" viewBox="544.181 91.484 43.016 43.016">
        <G>
          <Path d=" M 577.069 126.493 L 573.541 123.972 C 572.149 124.97 570.561 125.709 568.845 126.121 L 568.198 130 L 563.18 130 L 562.533 126.121 C 561.19 125.799 559.925 125.276 558.771 124.585 L 554.827 127.402 L 551.279 123.854 L 554.096 119.91 C 553.405 118.756 552.882 117.491 552.56 116.148 L 548.681 115.501 L 548.681 110.483 L 552.56 109.836 C 552.882 108.493 553.405 107.228 554.096 106.074 L 551.279 102.13 L 554.827 98.582 L 558.771 101.399 C 559.925 100.708 561.19 100.185 562.533 99.863 L 563.18 95.984 L 568.198 95.984 L 568.845 99.863 C 570.188 100.185 571.453 100.708 572.607 101.399 L 576.551 98.582 L 580.099 102.13 L 577.282 106.074 C 577.973 107.228 578.496 108.493 578.818 109.836 L 582.697 110.483 L 582.697 115.501 L 578.818 116.148 C 578.58 117.14 578.232 118.089 577.789 118.983 L 580.618 122.944 L 577.069 126.493 Z " fill="none" fillRule="evenodd" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Circle x="565.6889737462327" y="113.12450754940534" fill="none" r="5.062647735177279" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
        </G>
      </Svg>
    );
  }
  return (
    <Svg height="30" width="30" viewBox="544.181 91.484 43.016 43.016">
    	<G>
    		<Path d=" M 577.069 126.493 L 573.541 123.972 C 572.149 124.97 570.561 125.709 568.845 126.121 L 568.198 130 L 563.18 130 L 562.533 126.121 C 561.19 125.799 559.925 125.276 558.771 124.585 L 554.827 127.402 L 551.279 123.854 L 554.096 119.91 C 553.405 118.756 552.882 117.491 552.56 116.148 L 548.681 115.501 L 548.681 110.483 L 552.56 109.836 C 552.882 108.493 553.405 107.228 554.096 106.074 L 551.279 102.13 L 554.827 98.582 L 558.771 101.399 C 559.925 100.708 561.19 100.185 562.533 99.863 L 563.18 95.984 L 568.198 95.984 L 568.845 99.863 C 570.188 100.185 571.453 100.708 572.607 101.399 L 576.551 98.582 L 580.099 102.13 L 577.282 106.074 C 577.973 107.228 578.496 108.493 578.818 109.836 L 582.697 110.483 L 582.697 115.501 L 578.818 116.148 C 578.58 117.14 578.232 118.089 577.789 118.983 L 580.618 122.944 L 577.069 126.493 Z " fill="none" fillRule="evenodd" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    		<Circle x="565.6889737462327" y="113.12450754940534" fill="none" r="5.062647735177279" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    	</G>
    </Svg>
  );
}

 function Lightbulb(props: {multiplier?: number}) {
   if(!!props.multiplier){
     
     return (
       <Svg height={(54.354 * props.multiplier).toString()} width={(37.346 * props.multiplier)} viewBox="139.349 105.808 37.346 54.354">
         <G>
           <Path d=" M 172.196 124.482 C 172.196 116.659 165.845 110.308 158.022 110.308 C 150.2 110.308 143.849 116.659 143.849 124.482 L 143.849 124.482 C 143.849 133.566 152.353 137.927 152.353 147.159 L 163.692 147.159 C 163.692 137.813 172.196 133.511 172.196 124.482 L 172.196 124.482 Z " fill="none" fillRule="evenodd" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
           <Path d=" M 152.353 149.994 C 152.353 153.122 154.893 155.663 158.022 155.663 C 161.151 155.663 163.692 153.122 163.692 149.994 L 163.692 149.994 L 163.692 147.159 L 152.353 147.159 L 152.353 149.994 L 152.353 149.994 Z " fill="none" fillRule="evenodd" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
           <Path d=" M 156.506 146.841 L 156.506 131.209 C 156.417 129.883 155.729 129.05 154.431 128.699 C 153.011 128.243 151.243 129.59 151.243 131.209 C 151.243 132.416 152.254 133.505 153.769 133.726 L 161.681 133.87 C 163.55 134.093 164.593 133.27 164.801 131.392 C 164.769 129.632 164.028 128.657 162.568 128.455 C 160.574 128.496 159.597 129.417 159.628 131.209 L 159.628 146.841" fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="1"/>
         </G>
       </Svg>
     );
   } else {
    return (
      <Svg height='54.354' width="37.346" viewBox="139.349 105.808 37.346 54.354">
        <G>
          <Path d=" M 172.196 124.482 C 172.196 116.659 165.845 110.308 158.022 110.308 C 150.2 110.308 143.849 116.659 143.849 124.482 L 143.849 124.482 C 143.849 133.566 152.353 137.927 152.353 147.159 L 163.692 147.159 C 163.692 137.813 172.196 133.511 172.196 124.482 L 172.196 124.482 Z " fill="none" fillRule="evenodd" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Path d=" M 152.353 149.994 C 152.353 153.122 154.893 155.663 158.022 155.663 C 161.151 155.663 163.692 153.122 163.692 149.994 L 163.692 149.994 L 163.692 147.159 L 152.353 147.159 L 152.353 149.994 L 152.353 149.994 Z " fill="none" fillRule="evenodd" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="3"/>
          <Path d=" M 156.506 146.841 L 156.506 131.209 C 156.417 129.883 155.729 129.05 154.431 128.699 C 153.011 128.243 151.243 129.59 151.243 131.209 C 151.243 132.416 152.254 133.505 153.769 133.726 L 161.681 133.87 C 163.55 134.093 164.593 133.27 164.801 131.392 C 164.769 129.632 164.028 128.657 162.568 128.455 C 160.574 128.496 159.597 129.417 159.628 131.209 L 159.628 146.841" fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="1"/>
        </G>
      </Svg>
    );
   }
}
 function ManualHand(props: {multiplier?: number}) {
   if(!!props.multiplier){
     
     return (
    //   <Svg height={(110.589 * props.multiplier).toString()} width={(94.039 * props.multiplier).toString()} viewBox="516.737 351.111 94.039 110.589">
    // 	<Path d=" M 598.394 457.2 L 606.277 433.552 L 606.277 401.506 C 606.277 395.881 602.399 393.326 598.755 393.326 C 594.838 393.337 590.358 396.791 590.814 401.506 L 590.814 397.412 L 590.814 397.412 C 590.791 393.053 587.576 388.738 582.361 388.809 C 577.892 389.033 575.758 391.611 574.685 395.646 L 574.685 397.412 L 574.685 393.326 C 575.04 388.802 572.059 384.094 566.481 384.094 C 561.35 384.094 559.144 388.368 559.112 390.787 L 559.112 396.709 L 559.112 363.432 C 559.112 359.146 556.145 355.204 551.163 355.645 C 546.775 355.645 543.215 359.294 543.215 363.432 L 543.215 415.434 L 535.266 402.151 C 533.067 398.021 528.043 397.492 523.934 399.67 C 520.338 401.976 520.736 407.983 522.814 411.168 L 551.163 457.2 L 598.394 457.2 Z " fill="rgb(255,255,255)" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="5"/>
    // </Svg>
    <Svg height={(118.471 * props.multiplier).toString()} width={(94.039 * props.multiplier).toString()} viewBox="483.668 504.788 94.039 118.471">
    <Path d=" M 518.029 618.759 L 565.325 618.759 L 565.325 602.994 L 573.208 587.229 L 573.208 555.183 C 573.208 549.558 569.33 547.003 565.686 547.003 C 561.769 547.014 557.289 550.468 557.745 555.183 L 557.745 551.088 L 557.745 551.088 C 557.722 546.73 554.507 542.414 549.292 542.486 C 544.823 542.71 542.689 545.288 541.616 549.323 L 541.616 551.088 L 541.616 547.003 C 541.971 542.479 538.99 537.771 533.412 537.771 C 528.281 537.771 526.075 542.045 526.043 544.464 L 526.043 550.385 L 526.043 517.108 C 526.043 512.822 523.076 508.881 518.094 509.322 C 513.706 509.322 510.146 512.971 510.146 517.108 L 510.146 569.11 L 502.197 555.828 C 499.998 551.698 494.974 551.169 490.865 553.346 C 487.269 555.653 487.667 561.66 489.745 564.845 L 518.029 602.994 L 518.029 618.759 Z " fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="5"/>
  </Svg>
     );
   } else {
    return (
    //   <Svg height="110.589" width="94.039" viewBox="516.737 351.111 94.039 110.589">
    // 	<Path d=" M 598.394 457.2 L 606.277 433.552 L 606.277 401.506 C 606.277 395.881 602.399 393.326 598.755 393.326 C 594.838 393.337 590.358 396.791 590.814 401.506 L 590.814 397.412 L 590.814 397.412 C 590.791 393.053 587.576 388.738 582.361 388.809 C 577.892 389.033 575.758 391.611 574.685 395.646 L 574.685 397.412 L 574.685 393.326 C 575.04 388.802 572.059 384.094 566.481 384.094 C 561.35 384.094 559.144 388.368 559.112 390.787 L 559.112 396.709 L 559.112 363.432 C 559.112 359.146 556.145 355.204 551.163 355.645 C 546.775 355.645 543.215 359.294 543.215 363.432 L 543.215 415.434 L 535.266 402.151 C 533.067 398.021 528.043 397.492 523.934 399.67 C 520.338 401.976 520.736 407.983 522.814 411.168 L 551.163 457.2 L 598.394 457.2 Z " fill="rgb(255,255,255)" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="5"/>
    // </Svg>
    <Svg height="118.471" width="94.039" viewBox="483.668 504.788 94.039 118.471">
    <Path d=" M 518.029 618.759 L 565.325 618.759 L 565.325 602.994 L 573.208 587.229 L 573.208 555.183 C 573.208 549.558 569.33 547.003 565.686 547.003 C 561.769 547.014 557.289 550.468 557.745 555.183 L 557.745 551.088 L 557.745 551.088 C 557.722 546.73 554.507 542.414 549.292 542.486 C 544.823 542.71 542.689 545.288 541.616 549.323 L 541.616 551.088 L 541.616 547.003 C 541.971 542.479 538.99 537.771 533.412 537.771 C 528.281 537.771 526.075 542.045 526.043 544.464 L 526.043 550.385 L 526.043 517.108 C 526.043 512.822 523.076 508.881 518.094 509.322 C 513.706 509.322 510.146 512.971 510.146 517.108 L 510.146 569.11 L 502.197 555.828 C 499.998 551.698 494.974 551.169 490.865 553.346 C 487.269 555.653 487.667 561.66 489.745 564.845 L 518.029 602.994 L 518.029 618.759 Z " fill="none" stroke="rgb(140,100,255)" strokeLinecap="square" strokeWidth="5"/>
  </Svg>
    );
   }
}


function Profile(props: {accent?: boolean}) {
  if(props.accent){
    return (
      <Svg height="30" width="30" viewBox="598.136 94.484 37.016 37.016">
        <G>
          <Circle x="616.6441928078671" y="112.99212598425197" fill="none" r="17.00787401574803" stroke="rgb(140, 100, 255)" strokeLinecap="square" strokeWidth="3"/>
          <Circle x="616.6441928078674" y="108.992125984252" fill="none" r="7.086614173228327" stroke="rgb(140, 100, 255)" strokeLinecap="square" strokeWidth="3"/>
          <Path d=" M 605.422 125.108 C 608.001 121.732 612.071 119.561 616.644 119.561 C 620.922 119.561 624.759 121.46 627.355 124.466" fill="none" stroke="rgb(140, 100, 255)" strokeLinecap="square" strokeWidth="3"/>
        </G>
      </Svg>
    );
  }
  return (
    <Svg height="30" width="30" viewBox="598.136 94.484 37.016 37.016">
    	<G>
    		<Circle x="616.6441928078671" y="112.99212598425197" fill="none" r="17.00787401574803" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    		<Circle x="616.6441928078674" y="108.992125984252" fill="none" r="7.086614173228327" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    		<Path d=" M 605.422 125.108 C 608.001 121.732 612.071 119.561 616.644 119.561 C 620.922 119.561 624.759 121.46 627.355 124.466" fill="none" stroke="rgb(0,0,0)" strokeLinecap="square" strokeWidth="3"/>
    	</G>
    </Svg>
  );
}
