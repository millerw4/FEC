import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import uniq from 'lodash/uniq.js';

import RelatedItemsModal from './/comp/RelatedItemsModal.jsx';
import RelatedItemsList from './/comp/RelatedItemsList.jsx';
import YourOutfitList from './/comp/YourOutfitList.jsx';

import ElementContext from '../../ElementContext.js';

var RelatedItems = ({current, setCurrent}) => {
  const [related, setRelated] = useState([]);
  const [outfit, setOutfit] = useState([]);

  const [open, setOpen] = useState(false);
  const [comparison, setComparison] = useState([]);
  const [currentStyles, setCurrentStyles] = useState([]);

  const componentStyle = {
    fontFamily: 'Verdana, sans-serif',
    color: 'rgb(87 72 72)',
    backgroundColor: 'rgb(240, 240, 240)',
    width: '960px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  function compareToCurrent(item) {
    var newComparison = [[current.name, '', item.name], [current.default_price, 'Price', item.default_price]]
    var mapFeatures = (features) => {
      var featureObj = {};
      features.forEach(feature => featureObj[feature.feature] = feature.value);
      return featureObj;
    }
    var currentFeatures = mapFeatures(current.features);
    var comparatorFeatures = mapFeatures(item.features);
    var currentKeys = Object.keys(currentFeatures);
    var comparatorKeys = Object.keys(comparatorFeatures);
    var combinedKeys = uniq(currentKeys.concat(comparatorKeys)).sort();
    for (var i = 0; i < combinedKeys.length; i++) {
      newComparison.push([currentFeatures[combinedKeys[i]], combinedKeys[i], comparatorFeatures[combinedKeys[i]]]);
    }
    setComparison(newComparison);
  };

  function openComparisonModal(item) {
    compareToCurrent(item);
    setOpen(true);
  };

  function outfitIndexOf(item) {
    return outfit.map(outfitItem => outfitItem.id).indexOf(item.id);
  };

  function addToOutfit() {
    if(outfitIndexOf(current) >= 0) {
      return;
    }
    getProducts(`${current.id}/styles`)
      .then(results => {
        results = results.data.results;
        return results;
      })
      .then(styles => {
        var newOutfit = outfit.slice();
        var currentWithStyles = Object.assign({}, current); //only use what you need here
        //id, name, category, default_price, features, styles [{original_price, sale_price, default?, photos}, ...]
        currentWithStyles.styles = styles;
        newOutfit.push(currentWithStyles);
        setOutfit(newOutfit);
        localStorage.setItem('outfit', JSON.stringify(newOutfit));
      })
      .catch(err => console.log(err));
  };

  function removeFromOutfit(item) {
    var index = outfitIndexOf(item);
    var newOutfit = outfit.slice();
    newOutfit.splice(index, 1);
    setOutfit(newOutfit);
    localStorage.setItem('outfit', JSON.stringify(newOutfit));
  };

  function getProducts(suffix) {
    return axios.get(`/products${suffix === undefined ? '' : '/' + suffix}`)
      .catch((err) => {
        console.log(err);
      })
  };

  function setCurrentById(id) {
    getProducts(id)
        .then(res => setCurrent(res.data))
  };

  function getRelated() {
    let rel;
    if(!current.id) {
      return;
    }
    return getProducts(`${current.id}/related`)
      .then(res => {
        let relatedIds = uniq(res.data);
        relatedIds = relatedIds.map(id => getProducts(id));
        return Promise.all(relatedIds)
      })
      .then(results => {
        results = results.map(result => {
          return {
            id: result.data.id,
            name: result.data.name,
            category: result.data.category,
            default_price: result.data.default_price,
            features: result.data.features
          }
        });
        rel = results;
        return results;
      })
      .then(results => {
        return Promise.all(results.map(result => getProducts(`${result.id}/styles`)))
      })
      .then(results => {
        results = results.map(result => {
          return result.data.results.map(style => {
            return {
              original_price: style.original_price,
              sale_price: style.sale_price,
              'default?': style['default?'],
              photos: style.photos
            }
          })
        })
        return results;
      })
      .then(styles => {
        var relatedWithStyles = [];
        relatedWithStyles = Object.assign(relatedWithStyles, rel);
        for (var i = 0; i < relatedWithStyles.length; i++) {
          relatedWithStyles[i].styles = styles[i];
        }
        setRelated(relatedWithStyles);
      })
      .catch(err => console.log(err))
  };

  useEffect(() => {
    if(!current.id) {
      getProducts('37311')
        .then(res => setCurrent(res.data))
    }
    var outfit = JSON.parse(localStorage.getItem('outfit'));
    if (outfit !== null) {
      setOutfit(outfit);
      console.log(outfit)
    }
  }, []);

  useEffect(() => {
    if(current.id) {
      getRelated();
    }
  }, [current]);

  useEffect(() => {

  }, [outfit])

  return (
    <div style={componentStyle} >
      <ElementContext.Provider value='ri-modal'>
        <RelatedItemsModal
          open={open}
          setOpen={setOpen}
          comparison={comparison}
        />
      </ElementContext.Provider>
      <ElementContext.Provider value='ri-list'>
        <RelatedItemsList
          related={related}
          setCurrentById={setCurrentById}
          openComparisonModal={openComparisonModal}
        />
      </ElementContext.Provider>
      <ElementContext.Provider value='ri-outfit-list'>
        <YourOutfitList
          current={current}
          outfit={outfit}
          setCurrentById={setCurrentById}
          addToOutfit={addToOutfit}
          removeFromOutfit={removeFromOutfit}
        />
      </ElementContext.Provider>
    </div>
  );
}


export default RelatedItems;