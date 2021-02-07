<template>
  <div>
    <CRow class="pb-4 pl-2">
      <CCol class="b-1">
        <CAlert color="success" :show.sync="currentAlertCounter" closeButton>
          {{ message }}
          <CProgress
            :max="10"
            :value="currentAlertCounter"
            height="3px"
            color="success"
            animate
          />
        </CAlert>
      </CCol>
    </CRow>
    <CCard>
      <CCardBody>
        <CRow class="pb-4 pl-2">
          <CCol col="12">
            <CForm @submit.prevent="addCompanyFeatures">
              <CRow>
                <CCol sm="10" lg="4">
                  <CSelect
                    label="Company"
                    required
                    placeholder="Select Company"
                    :value.sync="companyId"
                    :options="companyList"
                    @update:value="getFeaturesList($event)"
                  />
                </CCol>
              </CRow>
             
              <CCol v-show="displayFeatures" col="4">
                <CInputCheckbox
                  v-for="(features, optionIndex) in featuresList"
                  :key="optionIndex + features.title"
                  :label="features.featureName"
                  :checked.sync="companyFeatures[features.featureId]"
                />
              </CCol>
              <CCol col="12" class="text-center">
                <CButton type="submit" :disabled="disabled" color="success"
                  >Add Features</CButton
                >
              </CCol>
            </CForm>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
const items = [{}];
const fields = [{ key: "companyName", _style: "width:40%" }];
export default {
  name: "AdvancedTables",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getCompanyList();
  },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      companyId: 0,
      companyList: [],
      details: [],
      currentAlertCounter: 0,
      collapseDuration: 0,
      featuresList: [],
      disabled: false,
      companyFeatures: {},
      displayFeatures: true,
    };
  },
  methods: {
    generateCompanyList(apiResponse) {
      if (apiResponse.error != true) {
        var companyList = apiResponse.data.companyList;
        apiResponse = "";
        this.companyList = this.changeListToSelect(
          companyList,
          "companyId",
          "companyName"
        );
      }
    },
    getCompanyList() {
      var param = {};
      var data = {};
      var url = "company/company/getCompanyList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCompanyList);
    },

    generateFeaturesList(apiResponse) {
      if (apiResponse.error != true) {
        this.featuresList = apiResponse.data.companyFeatures;
        this.featuresList.forEach((feature) => {
          if (feature.enabled == 1) {
            this.companyFeatures[feature.featureId] = true;
          }
        });
        this.displayFeatures = true;
      }
    },
    getFeaturesList() {
      this.displayFeatures = false;
      this.companyFeatures = {};
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;
      var url = "company/company/getCompanyFeatures";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateFeaturesList);
    },
    addCompanyFeatures() {
      var data = {};
      this.companyFeatures = this.arrayFilter(this.companyFeatures);
      data.featureId = Object.keys(this.companyFeatures);
      data.companyId = this.companyId;
      var param = {};
      data.limit = 0;
      var url = "company/company/mapCompanyFeatures";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.callBackaddCompanyFeatures);
    },
    callBackaddCompanyFeatures(apiResponse) {
      this.message = "Test series successfully updated";
      this.alertColor = "success";
      this.currentAlertCounter = 10;
    },
    populateCompanyFeatures(selectedValue) {
      var featuresIdStr = selectedValue.featuresId;
      var featuresIdArr = featuresIdStr.split(",");
      this.companyFeatures = {};
      featuresIdArr.forEach((featuresId) => {
        this.companyFeatures[featuresId] = true;
      });
    },
  },
};
</script>
