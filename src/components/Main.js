require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关的数据
let imageDatas = require('../../data/imageData.json');

//获取区间内的一个随机值
function getRangeRandom(left, right){
	return Math.ceil(Math.random()*(right-left)+left);
}

function get30DegRandom(){
	return (Math.random()>0.5?"":"-") +Math.ceil(Math.random()*30)
}

//将图片名信息转换成图片的URL信息
imageDatas = (function genImageURL(imageDataArr){
	for(let i=0,j=imageDataArr.length;i<j;i++){
		
		let singleImageData = imageDataArr[i];
		
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		
		imageDataArr[i] = singleImageData;
	}
	
	return imageDataArr;
})(imageDatas);


//imageDatas = genImageURL(imageDatas);

class ImgFigure extends React.Component {
	
	constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
	}
	/*
	 * 
	 */
	handleClick(e){
		if(this.props.arrange.isCenter){
		    this.props.inverse();
		}else{
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
		
	}
	
	render(){
		let styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		if(this.props.arrange.isCenter){
			styleObj['zIndex'] = 11;
			
		}
	    //如果图片的旋转角度有值，添加旋转css
		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
				styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));		
			}
		let imgFigureClassName = "img-figure";
		    imgFigureClassName += this.props.arrange.isInverse?' is-inverse ':'';
		
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
			<img src = {this.props.data.imageURL}
				alt = {this.props.data.title}
			/>
			<figcaption>
			<h2 className="img-title">{this.props.data.title}</h2>
			<div className="img-back" onClick={this.handleClick}>
			<p>
			{this.props.data.desc}
			</p>
			</div>
			</figcaption>
			</figure>
		)	
	}	
}
//控制组件 
class ControllerUnit extends React.Component {
	constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e){
		// 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
		e.stopPropagation();
		e.preventDefault();
	}
	
	
	render(){
		 let controlelrUnitClassName = "controller-unit";

	        // 如果对应的是居中的图片，显示控制按钮的居中态
	        if (this.props.arrange.isCenter) {
	            controlelrUnitClassName += " is-Center";

	            // 如果同时对应的是翻转图片， 显示控制按钮的翻转态
	            if (this.props.arrange.isInverse) {
	                controlelrUnitClassName += " is-inverse";
	            }
	        }
		return(
		<span className={controlelrUnitClassName} onClick={this.handleClick}></span>		
		);
	}
	
}
class AppComponent extends React.Component {
	constructor(props) {
        super(props);
        this.state = {imgArrangeArr: [
           /*{   	pos: {
        		left: '0',
        		top: '0'
        	},
        	rotate: 0, //旋转角度
        	isInverse: false, //图片正反面
            isCenter: false
        }*/
           ]};
        this.constant = {
        		centerPos:{
		  left: 0,
		  top:0
	  },
	  hPosRange: {
		  leftSecX: [0, 0],
		  rightSecX: [0, 0],
		  y: [0, 0]
	  },
	  vPosRange: {
		  x: [0, 0],
		  topY: [0, 0]
	  }};
     }
	
	/*
	 * 翻转图片
	 */
	inverse(index){
		return function(){
			let imgArrangeArr = this.state.imgArrangeArr;
			imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
			
			this.setState({
				imgArrangeArr:imgArrangeArr
			});
		}.bind(this);
		
	}
	
	
  /*
   * 重新布局所有图片
   */
  rearrange(centerIndex){
	  let imgArrangeArr = this.state.imgArrangeArr,
	      constant = this.constant,
	      centerPos = constant.centerPos,
	      hPosRange = constant.hPosRange,
	      vPosRange = constant.vPosRange,
	      hPosRangeLeftSecX = constant.hPosRange.leftSecX,
	      hPosRangeRightSecX = hPosRange.rightSecX,
	      hPosRangeY = hPosRange.y,
	      vPosRangeTopY = vPosRange.topY,
	      vPosRangeX = vPosRange.x,
	      
	      imgArrangeTopArr = [],
	      topImgNum = Math.floor(Math.random() * 2),
	      
	      topImgSpliceIndex = 0,
	      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex,1);
	      
	      imgArrangeCenterArr[0] = {
	    		  pos : centerPos,	
	              rotate : 0,
	              isCenter: true
	      }
	      
	      //中间的 图片不需要旋转
	   
	      
	      
	      topImgSpliceIndex = Math.ceil(Math.random()*(imgArrangeArr.length - topImgNum))
	      imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
	      
	      //布局上侧图片
	      imgArrangeTopArr.forEach(function(value,index){
	    	  imgArrangeTopArr[index] = {
	    			pos: {
	    	    			  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]), 
	    	    		      top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
	    	    			  
	    	    	},
	    	    	rotate:get30DegRandom(),
	    	    	isCenter: false
	    	  }
	      });
	      //布局左右两侧的图片
	      for(let i=0, j=imgArrangeArr.length, k=j/2; i<j; i++){
	    	  let hPosRangeLORX = null;
	    	  //
	    	  if(i < k){
	    		  hPosRangeLORX = hPosRangeLeftSecX;
	    	  }else{
	    		  hPosRangeLORX = hPosRangeRightSecX;
	    	  }
	    	  imgArrangeArr[i] = {
	    			  pos: {
	    	    			  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
	    	    			  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
	    	    	  },
	    	    	  rotate:get30DegRandom(),
	    	    	  isCenter: false
	    	  }
	      }
	      
	      if(imgArrangeTopArr && imgArrangeTopArr[0]){
	    	  imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
	      }
	      imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);
           
	      //更新状态
	      this.setState({
	    	  imgArrangeArr:imgArrangeArr
	      });
  }
  /*
   * 
   */
  center(index){
	  return function(){
		  this.rearrange(index);
	  }.bind(this);
	    }
  
  componentDidMount() {
	  console.log('componentDidMount ' + this.refs.stage);
	  //拿到舞台的大小
	  let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
	  	  stageW = stageDOM.scrollWidth,
	  	  stageH = stageDOM.scrollHeight,
	  	  halfStageW = Math.ceil(stageW / 2),
	  	  halfStageH = Math.ceil(stageH / 2);
	  //拿到一个imgfigure的大小
	  let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
	      imgW = imgFigureDOM.scrollWidth,
	      imgH = imgFigureDOM.scrollHeight,
	      halfImgW = Math.ceil(imgW / 2),
	      halfImgH = Math.ceil(imgH / 2);
	  
	  //计算中心图片的位置点
	  console.log(this.constant);
	  this.constant.centerPos = {
			  left: halfStageW - halfImgW,
			  top: halfStageH - halfImgH
	  }
	  //计算左侧位置图片
	  this.constant.hPosRange = {
			  leftSecX:[-halfImgW, halfStageW - halfImgW*3],
			  rightSecX:[halfStageW + halfImgW, stageW - halfImgW],
			  y:[-halfImgH, stageH - halfImgH]
	  }
	  this.constant.vPosRange = {
			  topY:[-halfImgH, halfStageH - halfImgH * 3],
			  x:[halfStageW - imgW, halfStageW]
	  }
	  
	  this.rearrange(0);
  }
  render() {
	 let controllerUnits = [],
	     imgFigures = [];
	// console.log(this.state);
	 imageDatas.forEach(function(value,index){
		 if (!this.state.imgArrangeArr[index]) {
			 this.state.imgArrangeArr[index] = {
					 pos: { 
						 left:0,
						 top:0
					 },
					 rotate: 0,
					 isInverse: false
			 }
		 }
		 imgFigures.push(<ImgFigure key={index} data={value} ref={"imgFigure" + index} arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		 controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
	 }.bind(this));
    return (
     <section className="stage" ref="stage">
     <section className="img-sec">
     {imgFigures}
     </section>
     <nav className="controller-nav">
     {controllerUnits}
     </nav>
     </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
