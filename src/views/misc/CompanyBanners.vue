<template>
  <div>
    <CRow>
      <CCol lg="4">
        <CSelect
          label="Company"
          required
          placeholder="Select Company"
          :options="companyList"
          :value.sync="companyId"
          @update:value="getBannerList()"
        />
      </CCol>
    </CRow>

    <CRow v-show="showBannerList">
      <CCol sm="12">
        <template>
          <CCard>
            <CCardHeader>
              <CButton color="success" @click="showBannerModal()">Add Banner</CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="items "
                :fields="tableFields"
                column-filter
                :items-per-page="20"
                hover
                sorter
                striped
                fixed
                bordered
                pagination
              >
              <template #bannerImage="{item}">
                <a :href= item.bannerImage target="_blank"><CImg :src=item.bannerImage width=80px; height=60px; /> </a>
              </template>
                <template #actions="{item}">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="editBanner(item)"
                    >Edit</CButton>
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
        </template>
      </CCol>
    </CRow>

    <CModal title="Add Banner" size="lg" :show.sync="bannerModal">
      <CForm @submit.prevent="addBanner()" wasValidated>
        <CRow>
          <CCol col="6">
            <CInput
              label="Banner name"
              v-model="bannerName"
              horizontal
              required
              placeholder="Enter Banner Name"
            />
          </CCol>
          <CCol col="6">
            <CInputFile
              required
              horizontal
              label="Banner"
              @change="handleFileUpload($event,'upload')"
              placeholder="Enter Banner"
            ></CInputFile>
          </CCol>
          <CCol col="6">
            <CInput
              required
              label="Valid From"
              type="datetime"
              v-model="validFrom"
              horizontal
              placeholder="Valid From"
            ></CInput>
          </CCol>
          <CCol col="6">
            <CInput
              required
              label="Valid To"
              type="datetime"
              v-model="validTo"
              horizontal
              placeholder="Valid To"
            ></CInput>
          </CCol>

          <CCol col="6">
            <CInputRadioGroup
              label="Banner type"
              required
              :options="[{ value: '', label: 'None'},
                        { value: 'testSeries', label: 'TestSeries'},
                        { value:'course', label: 'Courses'}]"
              :checked.sync="bannerType"
              horizontal
              inline
            />
          </CCol>

          <CCol col="6" v-show="bannerType ==='course'">
            <CSelect
              :value.sync="courseId"
              horizontal
              :options="courseList"
              placeholder="Select Course"
              label="Course"
            />
          </CCol>

          <CCol col="6" v-if="bannerType ==='testSeries'">
            <CSelect
              :value.sync="testSeriesId"
              horizontal
              :options="testSeriesList"
              placeholder="Select Test Series"
              label="Test Series"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol col="12" align="center">
            <CButton type="submit" :disabled="disabled" color="success">Add Banner</CButton>
          </CCol>
        </CRow>
      </CForm>
      <div slot="footer-wrapper"></div>
    </CModal>
  </div>
</template>
  

<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
const items = [{}];
const tableFields = [
  { key: "bannerName", _style: "width:20%" },
  { key: "bannerImage", _style: "width:20%;" },
  { key: "validFrom", _style: "width:20%;" },
  { key: "validTo", _style: "width:20%;" },
  {
    key: "actions",
    _style: "width:20%;",
    sorter: false,
    filter: false,
    label: "Actions"
  }
];
export default {
  name: "bannerList",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getToken();
    this.getCompanyList();
  },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      bannerId: 0,
      bannerName: "",
      bannerType: "",
      validFrom: "",
      validTo: "",
      disabled: false,
      companyList: [],
      courseList: [],
      testSeriesList: [],
      courseId: 0,
      testSeriesId: 0,
      showBannerList: false,
      companyId: 0,
      tableFields,
      details: [],
      fields: [],
      collapseDuration: 0,
      bannerModal: false,
      eventDateTime: ""
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
    generateBannerList(apiResponse) {
      if (apiResponse.error != true) {
        this.items = apiResponse.data.bannerList.map((item, id) => {
          return { ...item, id };
        });
      }
      this.showBannerList = true;
      this.bannerModal = false;
    },
    getBannerList() {
      this.showBannerList = false;
      var param = {};
      var data = {};
      data.companyId = this.companyId;
      data.currentOnly = false;
      var url = "company/company/getCustomBanners";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateBannerList);
      this.getCourseList();
      this.getTestSeriesList();
    },
    showBannerModal() {
      this.bannerId = 0;
      this.bannerModal = true;
    },
    addBanner() {
      var param = {};
      var data = {};
      data.bannerId = this.bannerId;
      data.companyId = this.companyId;
      data.bannerType = this.bannerType;
      if (data.bannerType == "course") {
        data.courseId = this.courseId;
      } else if (data.bannerType == "testSeries") {
        data.testSeriesId = this.testSeriesId;
      }
      data.bannerName = this.bannerName;
      data.validFrom = this.validFrom;
      data.validTo = this.validTo;
      var url = "company/company/addEditCustomBanner";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.getBannerList, this.fields);
    },
    editBanner(item) {
      this.bannerId = item.bannerId;
      this.bannerName = item.bannerName;
      this.validFrom = item.validFrom;
      this.validTo = item.validTo;
      var customData = JSON.parse(item.customData);
      this.bannerType = customData.bannerType;
      if (this.bannerType == "course") {
        this.courseId = customData.courseId;
      } else if (this.bannerType == "testSeries") {
        this.testSeriesId = customData.testSeriesId;
      }
      this.bannerId = item.bannerId;
      this.bannerModal = true;
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
    }
  },

};
</script>