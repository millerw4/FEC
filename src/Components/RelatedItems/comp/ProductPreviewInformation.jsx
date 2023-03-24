import React from 'react';// Bring React in to build a component.
import {useState, useEffect} from 'react';
import ProductStars from './ProductStars.jsx';


var ProductPreviewInformation = ({item}) => {
  const divStyle = {
    color: 'rgb(87 72 72)',
    // borderStyle: 'solid',
    // margin: '5%',
    padding: '5%',
    zIndex: 3,
    backgroundColor: '#d3d3d399',
    position: 'relative',
    // borderRadius: '0% 0% 10% 10%'
  };
  const h5Style = {
    margin: '1% 1% 1% 1%'
  }
  return (
    <div style={divStyle} >
      <h5 style={h5Style} >{item.category}</h5>
      <h5 style={h5Style} >{item.name}</h5>
      <h5 style={h5Style} >${item.default_price}</h5>
      <h5 style={h5Style} ><ProductStars id={item.id} size={'small'} /></h5>
    </div>
  );
}

export default ProductPreviewInformation