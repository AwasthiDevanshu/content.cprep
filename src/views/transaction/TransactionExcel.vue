<template>
  <div>
    <CRow>
     
 
        
      <CCol sm="12">
        <CForm @submit.prevent="getTransactionExcel()" wasValidated>
        <CRow>
     <CCol col="4">
        <CSelect
          label="Company"
          required
          placeholder="Select Company"
          :options="companyList"
          :value.sync="companyId"
          @update:value="getExtraFiltersData()"
        />
      </CCol>
 
          <CCol col="4" v-show="showFilters">
            <CInput
              label="Transaction From"
              type="datetime"
              v-model="fromDate"
              placeholder="Valid From"
            ></CInput>
          </CCol>
          <CCol col="4" v-show="showFilters">
            <CInput
              label="Transaction To"
              type="datetime"
              v-model="toDate"
              placeholder="Valid To"
            ></CInput>
          </CCol>
          <CCol col="4" v-show="showFilters">
            <CInputRadioGroup
              label="Transaction type"
              required
              :options="[
                        { value: 'testSeries', label: 'TestSeries'},
                        { value:'course', label: 'Courses'}]"
              :checked.sync="transactionType"
              inline
            />
          </CCol>

          <CCol col="4" v-show="transactionType ==='course'">
            <CSelect
              :value.sync="courseId"
              :options="courseList"
              placeholder="Select Course"
              label="Course"
            />
          </CCol>

          <CCol col="4" v-if="transactionType ==='testSeries'">
            <CSelect
              :value.sync="testSeriesId"
              :options="testSeriesList"
              placeholder="Select Test Series"
              label="Test Series"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol col="12" align="center">
            <CButton type="submit" :disabled="disabled" color="success">Download Excel</CButton>
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
  name: "transactionList",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getToken();
    this.getCompanyList();
  },
  data() {
    return {
    
      transactionId: 0,
      transactionName: "",
      transactionType: "",
      fromDate: "",
      toDate: "",
      disabled: false,
      companyList: [],
      courseList: [],
      testSeriesList: [],
      courseId: 0,
      testSeriesId: 0,
      candidateId:0,
      companyId: 0,
      showFilters:false
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
    downloadExcel(apiResponse) {
      if (apiResponse.error != true) {
        var fileUrl = apiResponse.data.fileUrl; 
        window.open(fileUrl,"_blank");
      }
    },
    getTransactionExcel() {
      var param = {};
      var data = {};
      data.companyId = this.companyId;
      data.courseId = this.courseId;
      data.fromDate = this.fromDate;
      data.toDate = this.toDate;
      data.candidateId = this.candidateId;
      data.testSeriesId = this.testSeriesId;
      data.transactionType = this.transactionType;
      data.currentOnly = false;
      var url = "transaction/transaction/getTransactionExcel";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.downloadExcel);
    },
    generateCourseList(apiResponse) {
      if (apiResponse.error != true) {
        var courseList = apiResponse.data.courseList;
        apiResponse = "";
        this.courseList = this.changeListToSelect(
          courseList,
          "courseId",
          "courseName"
        );
      }
    },
    getCourseList() {
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;
      var url = "course/course/getVideoCourseList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCourseList);
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
    },
    getTestSeriesList() {
      var param = {};
      var data = {};
      data.limit = 0;
      var url = "testSeries/testSeries/getTestSeriesList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateTestSeriesList);
    },
    getExtraFiltersData(){
        this.getCourseList();
        this.getTestSeriesList();
        this.showFilters = true;
    }
  }
};
</script>