<template>
  <div>
    <CRow class="pb-4 pl-2">
      <CCol class="b-1">
        <CToaster :autohide="3000">
          <template v-for="toast in fixedToasts">
            <CToast
              :key="'toast' + toast"
              :show="true"
              header="Data save Successful"
              color="success"
              >{{ message }}</CToast
            >
          </template>
        </CToaster>
        
      </CCol>
    </CRow>
    <CCard>
      <CCardBody>
        <CRow class="pb-4">
          <CCol col="6">
            <h5>Name : {{ candidateData.name }}</h5>
          </CCol>

          <CCol col="6">
            <h5>Username : {{ candidateData.username }}</h5>
          </CCol>

          <CCol col="6">
            <h5>Email : {{ candidateData.email }}</h5>
          </CCol>

          <CCol col="6">
            <h5>Mobile : {{ candidateData.mobile }}</h5>
          </CCol>
          <CCol col="12">
            <CForm @submit.prevent="mapCandidateCourseTestSeries">
              <CCard>
                <CCardHeader tag="header">
                  <CRow>
                    <CCol col="6" v-show="displayTestSeries"
                      >TestSeries List</CCol
                    >

                    <CCol col="6" v-show="displayTestSeries">Courses</CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol col="6" v-show="displayTestSeries">
                      <template
                        v-for="(testSeries, optionIndex) in candidateTestSeries"
                      >
                        <CInputCheckbox
                          :key="optionIndex + testSeries.title"
                          :label="labelTestSeries(testSeries)"
                          :checked.sync="testSeries.purchased"
                        />
                      </template>
                    </CCol>
                    <CCol col="6" v-show="displayTestSeries">
                      <template
                        v-for="(course, optionIndex) in candidateCourses"
                      >
                        <CInputCheckbox
                          :key="optionIndex + course.courseName"
                          :label="labelCourse(course)"
                          :checked.sync="course.purchased"
                        />
                      </template>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCol col="12" class="text-center">
                <CButton type="submit" :disabled="disabled" color="success"
                  >Save</CButton
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
    this.getCandidatePurchases();
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
      collapseDuration: 0,
      testSeriesList: [],
      disabled: false,
      candidateCourses: [],
      candidateTestSeries: [],
      candidateData: [],
      price: {},
      displayTestSeries: false,
      fixedToasts: 0,
    };
  },
  computed: {
    checkFeature() {
      let featureList = sessionStorage.getItem("featureList");
      if (featureList.includes("activePayment")) return true;
      return false;
    },
  },
  methods: {
    getCandidatePurchases() {
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.$route.params.companyId;
      data.candidateId = this.$route.params.candidateId;
      var url = "transaction/transaction/getCandidatePurchases";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.populateCandidatePurchases);
    },
    mapCandidateCourseTestSeries() {
      var data = {};
      data.candidateTestSeries = this.candidateTestSeries;
      data.candidateCourses = this.candidateCourses;
      data.companyId = this.$route.params.companyId;
      data.candidateId = this.$route.params.candidateId;
      var param = {};
      data.limit = 0;
      var url = "transaction/transaction/purchasedFromAdmin";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.callBackaddCompanyTestSeries);
    },
    callBackaddCompanyTestSeries(apiResponse) {
      this.message = "Successfully updated";
      this.alertColor = "success";
      this.fixedToasts++;
    },
    populateCandidatePurchases(apiResponse) {
      if (apiResponse.error != true) {
        this.candidateTestSeries = apiResponse.data.testSeriesList;
        this.candidateCourses = apiResponse.data.courseList;
        this.candidateData = apiResponse.data.candidateData;
      }
      this.displayTestSeries = true;
      console.log(this.candidateTestSeries);
    },
    labelTestSeries(item) {
      return item.title + " [₹" + item.price + "]";
    },
    labelCourse(item) {
      return item.courseName + " [₹" + item.price + "]";
    },
  },
};
</script>
          
