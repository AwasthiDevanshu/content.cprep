(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0df2c4"],{"897d":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("CRow",[s("CCol",{attrs:{sm:"12"}},[s("CCard",[[s("CCardBody",[s("CDataTable",{attrs:{items:e.items,fields:e.fields,"column-filter":"","items-per-page":20,hover:"",sorter:"",striped:"",fixed:"",bordered:"",pagination:""},scopedSlots:e._u([{key:"showCandidate",fn:function(t){var i=t.item,r=t.index;return[s("td",{staticClass:"py-2"},[s("CButton",{attrs:{color:"primary",variant:"outline",square:"",size:"sm"},on:{click:function(t){return e.showTestList(i,r)}}},[e._v("Show Test ")])],1)]}}])})],1)]],2)],1)],1)],1)},r=[],n=s("2df7"),a=s("12f3");function o(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,i)}return s}function l(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?o(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):o(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var u=[{}],d=[{key:"title",_style:"width:40%"},{key:"testSeriesType",_style:"width:40%"},{key:"showCandidate",label:"",_style:"width:20%;",sorter:!1,filter:!1}],f={name:"TestSeries List",mixins:[n["a"],a["a"]],beforeMount:function(){this.getTestSeriesList()},data:function(){return{items:u.map((function(e,t){return l(l({},e),{},{id:t})})),fields:d,details:[],testseriesName:"",collapseDuration:0}},methods:{generateTestSeriesList:function(e){if(1!=e.error){var t=e.data.testSeriesList;this.items=t.map((function(e,t){return e.testSeriesType=e.testSeriesType.title,l(l({},e),{},{id:t})}))}},getTestSeriesList:function(){var e={},t={limit:0},s="testSeries/testSeries/getTestSeriesList";e.data=t,e.token=this.getToken(),this.ajaxCall(s,e,this.generateTestSeriesList)},toggleDetails:function(e){var t=this;this.$set(this.items[e.id],"_toggled",!e._toggled),this.collapseDuration=300,this.$nextTick((function(){t.collapseDuration=0}))},addTestSeries:function(){this.disabled=!0;var e={},t={};t.testseriesName=this.testseriesName;var s="testseries/testseries/addEditTestSeries";e.data=t,e.token=this.getToken(),this.ajaxCall(s,e,this.getTestSeriesList),this.testseriesName},showTestList:function(e,t){this.$router.push("/testList/"+e.testSeriesId)}}},p=f,h=s("2877"),b=Object(h["a"])(p,i,r,!1,null,null,null);t["default"]=b.exports}}]);
//# sourceMappingURL=chunk-2d0df2c4.5f461884.js.map