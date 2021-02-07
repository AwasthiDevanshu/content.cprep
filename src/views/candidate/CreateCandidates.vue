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
            >{{message}}</CToast>
          </template>
        </CToaster>
        <CAlert color="success" :show.sync="currentAlertCounter" closeButton>
          {{message}}
          <CProgress :max="10" :value="currentAlertCounter" height="3px" color="success" animate />
        </CAlert>
      </CCol>
    </CRow>
    <CCard>
      <CCardBody>
        <CRow class="pb-4">
          
          <CCol col="12">
            <CForm @submit.prevent="createCandidateLogins">
                  <CRow>
                  <CCol sm="10" lg="4">
                  <CSelect
                    label="Company"
                    required
                    :value=companyId
                    placeholder="Select Company"
                    :options="companyList"
                    @update:value="getCompanyItems($event)"
                  />
                       </CCol>
                  </CRow>
              <CRow v-show = "showCompanyItems">
                    <CCol col ="6">
                      <CInput
                      label="Candidate Count"
                      type="number"
                    v-model="candidateCount"

                      required
                      />

                    </CCol>
                    <CCol col ="6">
                      <CInput
                      label="Login Prefix"
                      required
                      v-model=loginPrefix
                      />
                      
                    </CCol>
                  </CRow>
              <CCard v-show = "showCompanyItems">
                <CCardHeader tag="header">
                  <CRow>
                    <CCol col="6" v-show="displayTestSeries">TestSeries List</CCol>

                    <CCol col="6" v-show="displayTestSeries">Courses</CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol col="6" v-show="displayTestSeries">
                      <template v-for="(testSeries, optionIndex) in companyTestSeries">
                        <CInputCheckbox
                          :key="optionIndex + testSeries.title"
                          :label="testSeries.title"
                          :checked.sync="testSeries.purchased"
                        />
                      </template>
                    </CCol>
                    <CCol col="6" v-show="displayTestSeries">
                      <template v-for="(course, optionIndex) in companyCourses">
                        <CInputCheckbox
                          :key="optionIndex + course.courseName"
                          :label="course.courseName"
                          :checked.sync="course.purchased"
                        />
                      </template>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCol col="12" class="text-center">
                <CButton type="submit" :disabled="disabled" color="success">Save</CButton>
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
  beforeMount() {
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
      testSeriesList: [],
      disabled: false,
      companyCourses: [],
      companyTestSeries: [],
      candidateData: [],
      price: {},
      displayTestSeries: false,
      fixedToasts: 0,
      showCompanyItems:false,
      loginPrefix:"",
      companyMap:[],
      candidateCount:0
    };
  },
  methods: {
    generateCompanyList(apiResponse) {
      if (apiResponse.error != true) {
        var companyList = apiResponse.data.companyList;
        this.companyMap = this.arrayColumn(apiResponse.data.companyList,"companyName","companyId");

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
    createCandidateLogins() {
      var data = {};
      //filtering only selected testSeriesId
      var testSeriesIds =this.arrayColumn(this.companyTestSeries,"purchased","testSeriesId");
      testSeriesIds = this.arrayFilter(testSeriesIds);
      data.testSeriesIds = Object.keys(testSeriesIds);
      //filtering only selected courseId

      var courseIds =this.arrayColumn(this.companyCourses,"purchased","courseId");
      courseIds = this.arrayFilter(courseIds);
      data.courseIds = Object.keys(courseIds);
      data.candidateCount = this.candidateCount;
      data.loginPrefix = this.loginPrefix;
      data.companyId = this.companyId;
      var param = {};
      data.limit = 0;
      var url = "company/company/createCandidatesLogin";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.callBackCreateLogins);
    },
    
    callBackCreateLogins(apiResponse) {
      if (apiResponse.error != true) {
        var fileUrl = apiResponse.data.fileUrl; 
        window.open(fileUrl,"_blank");
      }
      this.message = "Logins created successfully";
      this.alertColor = "success";
      this.currentAlertCounter = 10;
      this.fixedToasts++;
    },
   
    getCompanyTestSeries(companyId) {
      this.companyId = companyId;
      this.displayTestSeries = false;
      this.price = this.get("defaultPrice");
      this.companyTestSeries = {};
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;

      var url = "company/company/getCompanyTestSeries";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.populateCompanyTestSeries);
    },
      populateCompanyTestSeries(apiResponse) {
      if (apiResponse.error != true) {
        this.companyTestSeries = apiResponse.data.testSeriesList;
        
      }
      this.displayTestSeries = true;
    },
    getCourseList(companyId) {
      this.showCourseList = false;
      var param = {};
      var data = {};
      data.limit = 0; 
      data.companyId = companyId;

      var url = "course/course/getVideoCourseList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCourseList);
    },   
    generateCourseList(apiResponse) {
      if (apiResponse.error != true) {
        this.companyCourses = apiResponse.data.courseList;
        this.items = course.map((item, id) => {
          return { ...item, id };
        });
        this.showCourseList = true;
      }
    },
    getCompanyItems(companyId){
      this.loginPrefix = this.companyMap[companyId]+"_";
      this.getCompanyTestSeries(companyId);
      this.getCourseList(companyId);
      this.showCompanyItems = true;
    }
  }
};
</script>
          
