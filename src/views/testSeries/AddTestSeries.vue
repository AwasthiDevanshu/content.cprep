<template>
  <div>
    <CRow>
      <CCol>
        <CAlert color="success" :show.sync="currentAlertCounter" closeButton>
          {{message}}
          <CProgress :max="10" :value="currentAlertCounter" height="3px" color="success" animate />
        </CAlert>
      </CCol>
    </CRow>
    <CRow col="12">
      <CCol col="12">
        <CForm  @submit.prevent ="addTestSeries()">
          <h1 class="text-center">Add TestSeries</h1>
          <p class="text-muted text-center">Kindly verify all details before submitting</p>
          <CRow>
            <CCol sm="10" lg="4">
              <CInput
                label="Title"
                required
                v-model="title"
                placeholder="Enter TestSeries Title"
              />
            </CCol>
            <CCol sm="10" lg="4">
              <CSelect
                label="Test Series Type"
                v-model="testSeriesType"
                required
                placeholder="Select Test Series Type"
                :options="testSeriesTypeList"
              />
            </CCol>
            <CCol sm="10" lg="4">
              <CInput
                label="Price"
                required
                type = "number"
                v-model="price"
                placeholder="Enter Price"
              />
            </CCol>
            <CCol sm="10" lg="4">
              <CInputFile
                label="Icon Image"
                @change="handleFileUpload($event,'testSeriesImage')"
                required
                placeholder="Enter Test Image"
              ></CInputFile>
            </CCol>
          </CRow>

          <CRow>
            <CCol col="12" class="text-center">
              <CButton type="submit" :disabled="disabled" color="success">Add TestSeries</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
    </CRow>
  </div>
</template>

 
<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
export default {
  name: "AddTestSeries",
  mixins: [ajaxCallMixin, localDb],

  data() {
    return {
      disabled: false,
      title: "",
      testSeriesTypeList: [],
      testSeriesType: [],
      price:0,
      currentAlertCounter: 0,
      fields:[]
    };
  },
  computed: {
    token: function() {
      return this.getToken();
    }
  },
  methods: {
    addTestSeries() {
      this.disabled = true;
      var param = {};
      var data = {};
      data.title = this.title;
      data.price = this.price;
      data.testSeriesType = this.getSelectedValues(this.testSeriesType);
      var url = "testSeries/testSeries/addEditTestSeries";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.callBackAddEditTestSeries,this.fields);
    },
    callBackAddEditTestSeries(apiResponse) {
      this.currentAlertCounter = 10;
      this.message = apiResponse.message;
      this.alertColor = "success";
      this.disabled = false;
    },
    getAddEventDropDown() {
      var param = {};
      var assessorId = this.$route.params.assessorId;
      var url = "testSeries/testSeries/getTestSeriesTypeList";

      param.data = {};
      param.token = this.token;
      this.ajaxCall(url, param, this.populateList);
    },
    populateList(apiResponse) {
      if (apiResponse.error != true) {
        this.testSeriesTypeList = this.changeMapToSelect(apiResponse.data.testSeriesTypeList);
      }
    }
  },
  beforeMount() {
    this.getAddEventDropDown();
  }
};
</script>