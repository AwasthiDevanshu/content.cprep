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
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardBody>
            <CForm @submit.prevent="addCourse()">
              <h1 class="text-center" v-if="!isEdit">Add Course</h1>
              <h1 class="text-center" v-else>Edit Course</h1>
              <p class="text-muted text-center">Kindly verify all details before submitting</p>
              <CRow>
                <CCol sm="10" lg="4">
                  <CInput label="Title" required v-model="title" placeholder="Enter Course Title" />
                </CCol>
                <CCol sm="10" lg="4">
                  <CSelect
                    label="Company"
                    :value.sync="companyId"
                    required
                    placeholder="Select Company"
                    :options="companyList"
                  />
                </CCol>

                <CCol sm="10" lg="4">
                  <CInput
                    label="Price (in rupees)"
                    required
                    type="number"
                    v-model="price"
                    placeholder="Enter price"
                  />
                </CCol>
                <CCol sm="10" lg="4">
                  <CInput
                    label="M.R.P (in rupees)"
                    required
                    type="number"
                    v-model="mrp"
                    placeholder="Enter M.R.P"
                  />
                </CCol>
                <CCol sm="10" lg="4">
                  <CInput
                    label="Duration (in mins)"
                    required
                    type="number"
                    v-model="duration"
                    placeholder="Enter duration"
                  />
                </CCol>
                <CCol sm="10" lg="4">
                  <CInput
                    label="Lecture Count"
                    required
                    type="number"
                    v-model="lectureCount"
                    placeholder="Enter lecture Count"
                  />
                </CCol>
                 <CCol sm="10" lg="4">
                  <CSelect
                    label="Course Type"
                    required
                    :value.sync="courseType"
                    :options="[
                      { value: '1', label: 'online' },
                      { value: '2', label: 'offline' },
                    ]"
                    placeholder="Select Course type"
                  />
                </CCol>

                <CCol sm="10" lg="4">
                  <CInputFile
                    label="Thumbnail"
                    @change="handleFileUpload($event,'thumbnail')"
                    placeholder="Enter Thumbnail"
                  ></CInputFile>
                </CCol>
                <CCol>
                  <quill-editor
                    ref="quillEditor"
                    class="editor"
                    required
                    v-model="description"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol col="12" class="text-center p-4">
                  <CButton type="submit" :disabled="disabled" color="success">Add Course</CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

 
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

// You can also register Quill modules in the component
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
export default {
  name: "AddCourse",
  mixins: [ajaxCallMixin, localDb],
  components: {
    quillEditor
  },
  data() {
    return {
      disabled: false,
      title: "",
      companyId: 0,
      companyList: [],
      duration: 0,
      description: "",
      lectureCount: 0,
      price: 0,
      currentAlertCounter: 0,
      fields: [],
      message: "",
      courseType:1,
      mrp:0,
      editorOption: {
        placeholder: "Enter Description",
        theme: "snow"
      }
    };
  },
  computed: {
    token: function() {
      return this.getToken();
    },
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    isEdit: function() {
      if (this.$route.params.courseId) {
        return true;
      }
      return false;
    }
  },
  methods: {
    addCourse() {
      this.disabled = true;
      var param = {};
      var data = {};
      var courseId = this.$route.params.courseId;
      data.courseId = courseId;
      data.courseName = this.title;
      data.duration = this.duration;
      data.price = this.price;
      data.lectureCount = this.lectureCount;
      data.description = this.description;
      data.companyId = this.companyId;
      data.tags = this.tags;
      data.courseType = this.courseType;
      data.mrp = this.mrp;
      var url = "course/course/addEditVideoCourse";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.callBackAddEditCourse, this.fields);
    },
    populateCourseDetails(apiResponse) {
      if (apiResponse.error != true) {
        this.title = apiResponse.data.courseName;
        this.companyId = apiResponse.data.companyId;
        this.duration = apiResponse.data.duration;
        this.price = apiResponse.data.price;
        this.lectureCount = apiResponse.data.lectureCount;
        this.description = apiResponse.data.description;
      }
    },
    getCourseDetails() {
      var param = {};
      var data = {};
      data.courseId = this.$route.params.courseId;
      var url = "course/course/getVideoCourseDetails";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.populateCourseDetails);
    },
    callBackAddEditCourse(apiResponse) {
      this.currentAlertCounter = 10;
      this.message = "Test Series has been added";
      this.alertColor = "success";
      this.disabled = false;

    },
    getCompanyDropDown() {
      var param = {};
      var assessorId = this.$route.params.assessorId;
      var url = "company/company/getCompanyList";

      param.data = {};
      param.token = this.token;
      this.ajaxCall(url, param, this.populateList);
    },
    populateList(apiResponse) {
      if (apiResponse.error != true) {
        this.companyList = this.changeListToSelect(
          apiResponse.data.companyList,
          "companyId",
          "companyName"
        );
      }
    }
  },
  beforeMount() {
    this.getCompanyDropDown();
  },
  created() {
    if (this.$route.params.courseId) {
      this.getCourseDetails();
    }
  }
};
</script>