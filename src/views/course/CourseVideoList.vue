<template>
  <div>
    <CRow>
      <CCol sm="12">
        <template>
          <CCard>
            <CCardBody>
              <CCardHeader>
                <CRow >
                  <CCol col="3">
                    <CButton color="success" @click="showVideoModal()"
                      >Add Videos</CButton
                    >
                  </CCol>
                  <CCol col="3">
                    <CButton color="success" @click="showVideoExcelModal()"
                      >Upload Videos Excel</CButton
                    >
                  </CCol>
                </CRow>
              </CCardHeader>
              <CDataTable
                :items="items"
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
                <template #actions="{ item }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="editVideo(item)"
                      >Edit</CButton
                    >
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="deleteVideo(item)"
                      >Delete</CButton
                    >
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
        </template>
      </CCol>
    </CRow>
    <CModal title="Upload Class Excel" size="lg" :show.sync="videoExcelModal">
      <CForm @submit.prevent="uploadCourseVideoExcel()" wasValidated>
        <CRow>
          <CCol col="6">
            <CInputFile
              horizontal
              label="Class Excel"
              required
              @change="handleFileUpload($event, 'excelFile')"
              placeholder="Select Excel"
            ></CInputFile>
          </CCol>

          <CCol col="6">
            <CInput
              label="Class Time"
              type="datetime-local"
              required
              v-model="eventDateTime"
              horizontal
              placeholder="Class Time"
            ></CInput>
          </CCol>
          <CCol col="6">
            <CInputFile
              horizontal
              label="Thumbnail"
              @change="handleFileUpload($event, 'thumbnail')"
              placeholder="Enter Thumbnail"
            ></CInputFile>
          </CCol>

          <CCol col="6">
            <CInputFile
              horizontal
              label="PDF"
              @change="handleFileUpload($event, 'pdf')"
              placeholder="Select pdf"
            ></CInputFile>
          </CCol>
        </CRow>

        <CRow>
          <CCol col="12" align="center">
            <CButton type="submit" :disabled="disabled" color="success">{{
              modalTitle
            }}</CButton>
          </CCol>
        </CRow>
      </CForm>
      <div slot="footer-wrapper"></div>
    </CModal>

    <CModal :title="modalTitle" size="lg" :show.sync="videoModal">
      <CForm @submit.prevent="addCourseVideo()" wasValidated>
        <CRow>
          <CCol col="6">
            <CInput
              required
              label="Video Title"
              v-model="title"
              horizontal
              placeholder="Enter Title"
            />
          </CCol>
          <CCol col="6">
            <CSelect
              label="Category"
              required
              :value.sync="videoCategory"
              :options="videoCategoryList"
              horizontal
              placeholder="Select Category"
            />
          </CCol>
          <CCol col="6">
            <CSelect
              required
              label="Video Source"
              :value.sync="hostedAt"
              horizontal
              :options="[
                { value: '1', label: 'youtube' },
                { value: '2', label: 'vimeo' },
              ]"
              placeholder="Select Source"
            />
          </CCol>

          <CCol col="6">
            <CInput
              label="Class Time"
              type="datetime-local"
              required
              v-model="eventDateTime"
              horizontal
              placeholder="Class Time"
            ></CInput>
          </CCol>
          <CCol col="6">
            <CInput
              required
              label="Duration"
              type="number"
              v-model="duration"
              horizontal
              placeholder="Duration in mins"
            ></CInput>
          </CCol>
          <CCol col="6">
            <CInput
              label="Url"
              v-model="url"
              horizontal
              placeholder="Enter url"
            />
          </CCol>
          <CCol col="6">
            <CInputFile
              horizontal
              label="Thumbnail"
              @change="handleFileUpload($event, 'thumbnail')"
              placeholder="Enter Thumbnail"
            ></CInputFile>
          </CCol>

          <CCol col="6">
            <CInputFile
              horizontal
              label="PDF"
              @change="handleFileUpload($event, 'pdf')"
              placeholder="Select pdf"
            ></CInputFile>
          </CCol>
          <CCol col="3">
            <CInputCheckbox
              variant="outline"
              size="lg"
              color="success"
              shape="pill"
              :checked.sync="chatEnabled"
              label="Enable Chat"
            />
          </CCol>

          <CCol col="3">
            <CInputCheckbox
              variant="outline"
              size="lg"
              color="success"
              shape="pill"
              :checked.sync="isPaid"
              label="Paid Class"
            />
          </CCol>
          <CCol v-show="thumbnail" col="3">
            <CLink :href="thumbnail" target="_blank"> Thumbnail </CLink>
          </CCol>
        </CRow>

        <CRow>
          <CCol col="12" align="center">
            <CButton type="submit" :disabled="disabled" color="success">{{
              modalTitle
            }}</CButton>
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
  { key: "videoId", _style: "width:20%" },
  { key: "title", _style: "width:20%" },
  { key: "url", _style: "width:20%;" },
  { key: "eventDateTime", _style: "width:20%;" },
  { key: "duration", _style: "width:20%;" },
  {
    key: "actions",
    _style: "width:20%;",
    sorter: false,
    filter: false,
    label: "Actions",
  },
];
export default {
  name: "video list",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getToken();
    this.getVideoList();
    this.getVideoCategoryList();
  },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      tableFields,
      title: "",
      hostedAt: 1,
      url: "",
      isPaid: 0,
      chatEnabled: 0,
      duration: "",
      password: "",
      details: [],
      fields: [],
      collapseDuration: 0,
      videoModal: false,
      videoExcelModal: false,
      eventDateTime: "",
      thumbnail: "",
      disabled: false,
      videoId: 0,
      modalTitle: "Add Video",
      videoCategory: "",
      videoCategoryList: [],
    };
  },
  methods: {
    generateVideoList(apiResponse) {
      if (apiResponse.error != true) {
        this.items = apiResponse.data.videoList.map((item, id) => {
          return { ...item, id };
        });
      }
      this.disabled = false;
      this.videoModal = false;
      this.videoExcelModal = false;
    },
    getVideoList() {
      var param = {};
      var courseId = this.$route.params.courseId;
      var data = { courseId: courseId };
      var url = "course/course/getVideoCourseDetails";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateVideoList);
    },
    showVideoModal() {
      this.videoId = 0;
      this.title = "";
      this.url = "";
      this.isPaid = 0;
      this.chatEnabled = 0;
      this.duration = 0;
      this.password = "";
      this.eventDateTime = "";
      this.modalTitle = "Add Video";
      this.videoModal = true;
      this.fields = [];
    },

    showVideoExcelModal() {
      this.videoId = 0;
      this.title = "";
      this.url = "";
      this.isPaid = 0;
      this.chatEnabled = 0;
      this.duration = 0;
      this.password = "";
      this.eventDateTime = "";
      this.modalTitle = "Add Video";
      this.videoExcelModal = true;
      this.fields = [];
    },
    getVideoCategoryList() {
      var param = {};
      var courseId = this.$route.params.courseId;
      var data = { courseId: courseId };
      var url = "course/course/getVideoCategoryList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateVideoCategoryList);
    },
    generateVideoCategoryList(apiResponse) {
      if (apiResponse.error != true) {
        const categoryList = apiResponse.data.categoryList;
        this.videoCategoryList = this.changeListToSelect(
          categoryList,
          "id",
          "categoryName"
        );
      }
    },
    addCourseVideo() {
      this.disabled = true;
      var param = {};
      var courseId = this.$route.params.courseId;
      var data = { courseId: courseId };
      data.videoId = this.videoId;
      data.title = this.title;
      data.hostedAt = this.hostedAt;
      data.url = this.url;
      data.isPaid = this.isPaid;
      data.chatEnabled = this.chatEnabled;
      data.duration = this.duration;
      data.password = this.password;
      data.videoCategory = this.videoCategory;
      data.eventDateTime = this.eventDateTime;
      var url = "course/course/addVideoToCourse";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.getVideoList, this.fields);
    },
    editVideo(item) {
      this.videoId = item.videoId;
      this.title = item.title;
      this.hostedAt = item.hostedAt;
      this.url = item.url;
      this.isPaid = item.isPaid;
      this.chatEnabled = item.chatEnabled;
      this.duration = item.duration;
      this.password = item.password;
      this.thumbnail = item.thumbnail;
      this.videoCategory = item.videoCategory;
      this.eventDateTime = item.eventDateTime;
      this.modalTitle = "Edit Video";
      this.fields = [];
      this.videoModal = true;
    },
    deleteVideo(item) {
      var param = {};
      var data = {};
      data.videoId = item.videoId;
      var url = "course/course/deleteVideo";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.getVideoList, this.fields);
    },
    uploadCourseVideoExcel() {
      this.disabled = true;
      var param = {};
      var courseId = this.$route.params.courseId;
      var data = { courseId: courseId };
      data.hostedAt = 1;
      data.isPaid = 1;
      data.chatEnabled = 0;
      data.duration = 60;
      data.password = "";
      data.eventDateTime = this.eventDateTime;
      var url = "course/course/uploadVideoToCourse";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.getVideoList, this.fields);
    },
  },
};
</script>