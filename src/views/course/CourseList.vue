<template>
  <div>
    <CRow>
      <CCol sm="10" lg="4">
        <CSelect
          label="Company"
          required
          placeholder="Select Company"
          :options="companyList"
          :value.sync="companyId"
          @update:value="getCourseList()"
        />
      </CCol>
    </CRow>
    <CRow v-if="showCourseList">
      <CCol md="4" sm="12">
        <CEmbed
          aspect="16by9"
          type="embed"
          :src="embedSrc"
          frameborder="0"
          allow="accelerometer;autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      </CCol>
      <CCol sm="12">
        <CCard>
          <template>
            <CCardBody>
              <CDataTable
                :items="items"
                :fields="fields"
                column-filter
                :items-per-page="20"
                hover
                sorter
                striped
                fixed
                bordered
                pagination
              >
                <template #actions="{ item }">
                  <td>
                    <CRow>
                      <CCol col="5">
                        <CButton
                          class="btn btn-outline-primary btn-sm"
                          :to="showCourseVideoList(item)"
                          >Show Videos
                        </CButton>
                      </CCol>
                      <CCol col="3">
                        <CLink
                          class="btn btn-outline-primary btn-sm"
                          :to="editCourseList(item)"
                        >
                          Edit
                        </CLink>
                      </CCol>
                      <CCol sm="3">
                        <CButton
                          color="primary"
                          variant="outline"
                          square
                          size="sm"
                          @click="deleteCourse(item)"
                          >Delete
                        </CButton>
                      </CCol>
                    </CRow>
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
          </template>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
  
<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
import axios from "axios";

const items = [{}];
const fields = [
  { key: "courseId", _style: "width:10%" },
  { key: "courseName", _style: "width:20%" },
  { key: "price", _style: "width:10%" },
  {
    key: "actions",
    label: "",
    _style: "width:20%;",
    sorter: false,
    filter: false,
  },
];
export default {
  name: "CourseList",
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
      details: [],
      courseName: "",
      collapseDuration: 0,
      showCourseList: false,
      companyList: [],
      companyId: 0,
      embedSrc: "",
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

    generateCourseList(apiResponse) {
      if (apiResponse.error != true) {
        var course = apiResponse.data.courseList;
        this.items = course.map((item, id) => {
          return { ...item, id };
        });
        this.embedSrc =
          "https://www.youtube.com/embed/live_stream?channel=" +
          apiResponse.data.channelId;
        this.showCourseList = true;
      }
    },
    getCourseList() {
      this.showCourseList = false;
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;
      var url = "course/course/getVideoCourseList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCourseList);
    },
    toggleDetails(item) {
      this.$set(this.items[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    showCourseVideoList(item) {
      return "/courseVideos/" + item.courseId;
      this.$router.push("/courseVideos/" + item.courseId);
    },
    editCourseList(item) {
      return "/editCourse/" + item.courseId;
    },
    deleteCourse(item) {
      var param = {};
      var data = {};
      data.courseId = item.courseId;
      var url = "course/course/deleteVideoCourse";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.getCourseList);
    },
  },
};
</script>