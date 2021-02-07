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
    <CRow col="12">
      <CCol col="12">
        <CForm  @submit.prevent ="getPublicUrl()">
          <CRow>
            <CCol sm="10" lg="4">
              <CInput
                horizontal
                label="FileName"
                required
                v-model="filename"
                placeholder="Enter FileName"
              />
            </CCol>
            <CCol sm="10" lg="4">
              <CInputFile
                label="File"
                @change="handleFileUpload($event,'upload')"
                required
                horizontal
                placeholder="upload file"
              ></CInputFile>
            </CCol>
            <CCol sm="10" lg="4">
              <CButton type="submit" :disabled="disabled" color="success">Upload File</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
      <CCol col = "12" >
            {{fileUrl}}
      </CCol>
    </CRow>

    <CRow>
      <CCol>
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
                <template #actions="{item}">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="deleteFile(item)"
                    >Delete File</CButton>
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
const items = [{}];
const fields = [
  { key: "fileName", _style: "width:40%" },
  { key: "publicUrl", _style: "width:40%" },
  {
    key: "actions",
    label: "",
    filter: false,
    sorter: false,
    _style: "width:20%"
  }
];

export default {
  name: "getPublicUrl",
  mixins: [ajaxCallMixin, localDb],

  data() {
    return {
      disabled: false,
      filename: "",
      price: 0,
      fileUrl: "",

      message: "",
      currentAlertCounter: 0,
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields
    };
  },
  computed: {
    token: function() {
      return this.getToken();
    }
  },
  methods: {
    getPublicUrl() {
      this.disabled = true;
      var param = {};
      var data = {};
      data.fileName = this.filename;
      var url = "api/internalApi/getPublicUrlForFile";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.callBackFileUpload, this.fields);
    },
    callBackFileUpload(apiResponse) {
      this.currentAlertCounter = 10;
      this.message = "File has been uploaded";
      this.fileUrl = apiResponse.data.publicUrl;
      this.getFileList();
      this.alertColor = "success";
      this.disabled = false;
    },
    getFileList() {
      var param = {};
      var url = "api/internalApi/getPublicFileList";
      param.data = {};
      param.token = this.token;
      this.ajaxCall(url, param, this.populateList);
    },
    populateList(apiResponse) {
      if (apiResponse.error != true) {
        var fileList = apiResponse.data.fileList;
        this.items = fileList.map((item, id) => {
          return { ...item, id };
        });
        console.log(this.items);
      }
    },
    deleteFile(item){
      var param = {};
      var url = "api/internalApi/deletePublicFile";
      param.data = {fileId: item.fileId};
      param.token = this.token;
      this.ajaxCall(url, param, this.callBackFileDelete);
    },
    callBackFileDelete(apiResponse) {
      this.currentAlertCounter = 10;
      this.message = "File has been deleted";
      this.fileUrl = apiResponse.data.publicUrl;
      this.getFileList();
      this.alertColor = "success";
      this.disabled = false;
    },
  },
  beforeMount() {
    this.getFileList();
  }
};
</script>