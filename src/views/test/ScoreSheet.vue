<template>
  <div>
    <CRow class="pb-4 pl-2">
      <CCol class="b-1">
        <CToaster :autohide="3000">
          <template v-for="toast in fixedToasts">
            <CToast
              :key="'toast' + toast"
              :show="true"
              header="Excel Download"
              color="success"
              >{{ message }}</CToast
            >
          </template>
        </CToaster>
      </CCol>
    </CRow>
        <CForm @submit.prevent="downloadResult()">
    <CRow>

      <CCol sm="10" lg="4">
        <CSelect
          label="Company"
          required
          placeholder="Select Company"
          :options="companyList"
          :value.sync="companyId"
          @update:value="getCompanyTestSeries()"
        />
      </CCol>
      <CCol sm="10" lg="4" v-show="displayTestSeries">
        <CSelect
          label="Test Series"
          required
          placeholder="Select TestSeries"
          :options="testSeriesList"
          :value.sync="testSeriesId"
          @update:value="getTestList()"
        />
      </CCol>
      <CCol sm="10" lg="4" v-show="displayTestList">
        <CSelect
          label="Test "
          required
          placeholder="Select Test"
          :options="testList"
          :value.sync="testId"
        />
      </CCol>
      <CCol col="12" align="center">
        <CButton type="submit" :disabled="disabled" color="success"
          >Download Excel</CButton
        >
      </CCol>
    </CRow>

      </CForm>
  </div>
</template>

<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
const items = [{}];
const fields = [{ key: "companyName", _style: "width:40%" }];
export default {
  name: "ScoreSheet",
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
      testSeriesId: 0,
      testId: 0,
      companyList: [],
      testSeriesList: [],
      testList: [],
      details: [],
      currentAlertCounter: 0,
      collapseDuration: 0,

      disabled: false,
      displayTestSeries: false,
      displayTestList: false,
      fixedToasts: 0,
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
    getCompanyTestSeries() {
      this.displayTestSeries = false;
      this.companyTestSeries = {};
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;
      var url = "company/company/getCompanyTestSeries";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateTestSeriesList);
    },
    generateTestSeriesList(apiResponse) {
      if (apiResponse.error != true) {
        var testSeriesList = apiResponse.data.testSeriesList;
        apiResponse = "";
        this.testSeriesList = this.changeListToSelect(
          testSeriesList,
          "testSeriesId",
          "title"
        );
      }
      this.displayTestSeries = true;
    },
    getTestList() {
      this.displayTestList = false;
      this.companyTestSeries = {};
      var param = {};
      var data = {};
      data.limit = 0;
      data.testSeriesId = this.testSeriesId;
      var url = "testSeries/testSeries/getTestList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateTestList);
    },
    generateTestList(apiResponse) {
      if (apiResponse.error != true) {
        var testList = apiResponse.data.testList;
        apiResponse = "";
        this.testList = this.changeListToSelect(testList, "testId", "testName");
      }
      this.displayTestList = true;
    },
    downloadResult() {
      var url = "company/Result/getResultDetails";
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;
      data.testId = this.testId;
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.downloadExcel);
    },
    downloadExcel(apiResponse) {
      if (apiResponse.error != true) {
        var fileUrl = apiResponse.data.fileUrl;
        window.open(fileUrl, "_blank");
      }
    },
  },
};
</script>
