<template>
  <div>
    <CRow>
      <CCol>
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
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardBody>
            <CForm @submit.prevent="addCourse()">
              <h1 class="text-center">Add currentAffair</h1>
              <p class="text-muted text-center">
                Kindly verify all details before submitting
              </p>
              <CRow>
                <CCol sm="10" lg="4">
                  <CInput
                    label="Title"
                    required
                    v-model="title"
                    placeholder="Enter Title"
                  />
                </CCol>

                <CCol sm="10" lg="4">
                  <CInputFile
                    label="Thumbnail"
                    @change="handleFileUpload($event, 'thumbnail')"
                    required
                    placeholder="Enter Thumbnail"
                  ></CInputFile>
                </CCol>
                <!-- <CCol sm="10" lg="4">
              <CTextarea label="Refrences"
               v-model="title" placeholder="Enter refrences" />
            </CCol>  -->

                <CCol>
                  <quill-editor
                    ref="quillEditor"
                    class="editor"
                    required
                    v-model="body"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol col="12" class="text-center p-4">
                  <CButton type="submit" :disabled="disabled" color="success"
                    >Save</CButton
                  >
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
  name: "AddCurrentAffair",
  mixins: [ajaxCallMixin, localDb],
  components: {
    quillEditor,
  },
  data() {
    return {
      disabled: false,
      title: "",
      companyId: 0,
      companyList: [],
      duration: 0,
      body: "",
      lectureCount: 0,
      price: 0,
      currentAlertCounter: 0,
      fields: [],
      message: "",
      editorOption: {
        placeholder: "Enter Body",
        theme: "snow",
      },
    };
  },
  computed: {
    token: function() {
      return this.getToken();
    },
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  methods: {
    addCourse() {
      this.disabled = true;
      var param = {};
      var data = {};
      data.courseName = this.title;
      data.duration = this.duration;
      data.price = this.price;
      data.lectureCount = this.lectureCount;
      data.body = this.body;
      data.tags = this.tags;
      var url = "course/course/addEditVideoCourse";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.callBackAddEditCourse, this.fields);
    },
    callBackAddEditCourse(apiResponse) {
      this.currentAlertCounter = 10;
      this.message = "Test Series has been added";
      this.alertColor = "success";
      this.disabled = false;
    },
  },
  beforeMount() {

  },
};
</script>
