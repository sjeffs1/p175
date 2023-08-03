var elementsArray = [];
var A = ["H", "Li", "Na", "K"]
var B = ["F", "Cl", "Br", "I"]

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var elementName = this.el.getAttribute("element_name")
      var barcodeValue = this.el.getAttribute("value")
      elementsArray.push({element_name: elementName, barcode_value: barcodeValue})
      compounds[barcodeValue]["compounds"].map((item)=>{
        var compound = document.querySelector(`#${item.compound_name}-${barcodeValue}`)
        compound.setAttribute("visible", false)
      })
      var atom = document.querySelector(`#${elementName}-${barcode_value}`)
      atom.setAttribute("visible", true)
      
    });

    this.el.addEventListener("markerLost", () => {
      var elementName = this.el.getAttribute("element_name")
      var index = elementsArray.findIndex(x =>{
        x.element_name === elementName
      })
      if(index > -1){
        elementsArray.splice(index, 1)
      }
    });
  },

  getModelGeometry: function (models, modelName) { 
    var barcodes = Object.keys (models);
    for (var barcode of barcodes) {
      if (models [barcode].model_name === modelName) { 
        return {
          position: models [barcode]["placement_position"], 
          rotation: models [barcode]["placement_rotation"], 
          scale: models[barcode]["placement_scale"], 
          model_url: models [barcode]["model_url"]
      };
    }
    }
  },

  placeTheModel: function (modelName, models) {
    var isListContainModel = this.isModelPresentInArray(modellist, modelName); 
    if (isListContainModel) {
      var distance = null;
      var marker1 = document.querySelector(`#marker-base`);
      var marker2 = document.querySelector(`#marker-${modelName}`);

      distance = this.getDistance (marker1, marker2);
      if (distance < 1.25) {
        // Changing Model Visibility
        var modelE1 = document.querySelector(`#${modelName}`);
        modelEl.setAttribute("visible", false);

        // Checking Model placed or not in scene
        var isModelPlaced = document.querySelector(`#model-${modelName}`); 
        if (isModelPlaced === null) {
          var el = document.createElement("a-entity");
          var modelGeometry = this.getModelGeometry (models, modelName); 
          el.setAttribute("id", `model-${modelName}`);
          el.setAttribute("gltf-model", `url(${modelGeometry.model_url})`); 
          el.setAttribute("position", modelGeometry.position);
          el.setAttribute("rotation", modelGeometry.rotation);
          el.setAttribute("scale", modelGeometry.scale);
          marker1.appendChild(el);
        }
      }
    }
  },


  isModelPresentInArray: function(arr, val) {
    for (var i of arr) {
      if (i.model_name === val) {
        return true;
      }
    }
    return false;
  },
  
  tick: async function() {
    if (modelList.length > 1) {
      var isBaseModelPresent = this.isModelPresentInArray(modellist, "base"); 
      var messageText = document.querySelector("#message-text");
      
      if (!isBaseModelPresent) {
        messageText.setAttribute("visible", true);
      } else {
        if (models === null) {
          models = await this.getModels();
      }
      messageText.setAttribute("visible", false);  
      this.placeTheModel ("road", models); 
      this.placeTheModel ("car", models);
      this.placeTheModel("building1", models);
      this.placeTheModel ("building2", models);
      this.placeTheModel("building", models);
      this.placeTheModel ("tree", models); 
      this.placeTheModel ("sun", models);
          }
        }
      },
      
  getCompound:function () {
    for(var el of elementsArray){
      if(A.includes(el.element_name)){
        var compound = el.element_name
        for(var i of elementsArray){
          if(B.includes(i.element_name)){
            compound += i.elementName
            return{name: compound, value: el.barcode_value}
          }
        }
      }
    }
  },
      
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position)
  },

  showCompound: function (compound) {
    //Hide elements
    elementsArray.map(item => {
      var el = document.querySelector(`#${item.element_name}-${item.barcode_value}`);
      el.setAttribute("visible", false);
    });
    //Show Compound
    var compound = document.querySelector(`#${compound.name}-${compound.value}`);
    compound.setAttribute("visible", true);
  },
  getCompounds: function () {
    // NOTE: Use ngrok server to get json values
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
});
