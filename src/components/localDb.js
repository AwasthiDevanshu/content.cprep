import "core-js/stable";
import "regenerator-runtime/runtime";
import _ from 'lodash';

export const localDb = {
  response: {},
  methods: {
    save: async function (key, data, callBack = null) {
        const parsed = JSON.stringify(data);
        localStorage.setItem(key, parsed);
    },
    get:  function (key, callBack = null) {
        if (localStorage.getItem(key)) {
            try {
              return JSON.parse(localStorage.getItem(key));
            } catch(e) {
              localStorage.removeItem(key);
            }
            
        }
    },
    remove: async function (key, callBack = null) {
        localStorage.removeItem(key);   
      },
    getToken: function () {
      if (localStorage.getItem("token")) {
          try {
            var token = this.get("token");
            var tokenExpiry = this.get("tokenExpiry");
            var expiryTime = tokenExpiry;
            var currentTimeStamp = Math.round(new Date().getTime()/1000);
            if(expiryTime > currentTimeStamp){
              return token;
            }
          } catch(e) {
            this.remove("token");
          }
        }
       this.$router.push("/");
      },
    handleFileUpload (files,name){
      this.fields[name] = files[0];
    },
    getSelectedValues (event,field ,callBack = null){
      var value = [];
      if(!event.target){
        value = "";
      }
      else if(event.target.multiple){
        const { options } = event.target;
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
      }
      else{
        value = event.target.value;
      }
      this[field] = value;
      if(callBack != null){
        callBack(value);
      }
      return value;
    },
    arrayKeys(obj){
      return Object.keys(obj);
    },
    arrayColumn(obj,column  ,key = null){
      var returnValue = _.chain(obj);
      if(key != null){
        returnValue = returnValue.keyBy(key);
      } if(column != null){
        returnValue = returnValue.mapValues(column);
      }
      return returnValue.value();
    },
    arrayFilter(mapObject, callBack = null){
      var returnVar = {};
      if(callBack != null){
      for (let [key, value] of Object.entries(mapObject)) {
        if(callBack(value)){
          returnVar[key] = value;
        }
      }
      }
      else{
      for (let [key, value] of Object.entries(mapObject)) {

        if(!(value == null || value == false || value == undefined || value == ""))
        {
          returnVar[key] = value;
        }
      }
      }
      return returnVar;
    },
    changeMapToSelect(mapObject) {
      var selectList = [];
      for (let [key, value] of Object.entries(mapObject)) {
        selectList.push({ value: key, label: value });
      }
      return selectList;
    },
    changeListToSelect(listObject, valueObj, label){
      var selectList = [];
      if(Array.isArray(valueObj)){
        for (let [key,obj] of Object.entries(listObject)) {
          var val = {};
          valueObj.forEach(function(value){
            val[value] = obj[value];  
          })
          val = JSON.stringify(val);
          selectList.push({ value: val, label: obj[label] });
        }
        
      }
      else{
        for (let [key,obj] of Object.entries(listObject)) {
          selectList.push({ value: obj[valueObj], label: obj[label] });
        }
      }
      return selectList;
    }
    
  }
}
