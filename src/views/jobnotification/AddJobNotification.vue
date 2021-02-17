<template>
  <div>

    <CToaster :autohide="3000" position="bottom-center">
      <template v-for="toast in fixedToasts">
        <CToast
          :key="'toast' + toast"
          :show="true"
          class="text-white"
          :class="{ 'bg-success': !hasError, 'bg-danger': hasError }"
          >{{ message }}</CToast
        >
      </template>
    </CToaster>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardBody>
            <CForm @submit.prevent="addEditJobNotification()">
              <h1 class="text-center" v-if="!isEdit">Add Job Notification</h1>
              <h1 class="text-center" v-else>Edit Job Notification </h1>
              <p class="text-muted text-center">Kindly verify all details before submitting</p>
              <CRow>
                <CCol sm="10" lg="4">
                  <CInput label="Title" required v-model="title" placeholder="Enter Job Title" />
                </CCol>
                <CCol sm="10" lg="4">
                  <CInputFile
                    label="Thumbnail"
                    @change="handleFileUpload($event,'thumbnail')"
                    placeholder="Enter Thumbnail"
                  ></CInputFile>
                </CCol>
             </CRow>
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
              

              <CRow>
                <CCol col="12" class="text-center p-4">
                  <CButton type="submit" :disabled="disabled" color="success">Add Job Notification</CButton>
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
      description: "",
      currentAlertCounter: 0,
      fields: [],
      fixedToasts: 0,
      GetJobDetails: "",
      message: "Hello World",
      hasError: false,
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
    addEditJobNotification() {
      this.disabled = true;
      var param = {};
      var data = {};
      var jobId = this.$route.params.jobId;
      data.jobId = jobId;
      data.title = this.title;
      data.description = this.description;
      var url = "misc/jobNotification/addEditJobNotification";
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
        this.GetJobDetails = apiResponse.data.getJobNotificationDetails;
      }
    },
    callBackAddEditCourse(apiResponse) {
      this.currentAlertCounter = 10;
      this.message = "Job Notification Sent Successfully";
      this.alertColor = "success";
      this.disabled = false;
        this.fixedToasts++;
    },
    
  },
};
</script>