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
            <CForm @submit.prevent="uploadCurrentAffair()">
              <h1 class="text-center">Upload Current-Affairs</h1>
              <p class="text-muted text-center">
                Kindly verify all details before submitting,
                <CLink href="/samplecurrentaffair.docx" download>
                  Sample Docx
                </CLink>
              </p>
              <CRow >
                <CCol sm="10" lg="4">
                  <CInputFile
                    label="Current Affair Docx"
                    @change="handleFileUpload($event, 'currentAffair')"
                    required
                    placeholder="Select Docx"
                  ></CInputFile>
                  <span>max file size 2 mb</span>
                </CCol>
                <CCol> </CCol>
              </CRow>

              <CRow>
                <CCol col="12" class="text-center p-4">
                  <CButton type="submit" :disabled="disabled" color="success"
                    >Upload</CButton
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
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
export default {
  name: "AddCurrentAffair",
  mixins: [ajaxCallMixin, localDb],
  components: {},
  data() {
    return {
      disabled: false,
      fields: [],
      currentAlertCounter: false,
    };
  },
  computed: {
    token: function() {
      return this.getToken();
    },
  },
  methods: {
    uploadCurrentAffair() {
      this.disabled = true;
      var param = {};
      var data = {};
      var url = "misc/currentAffair/uploadDocx";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.uploadCallBack, this.fields);
    },
    uploadCallBack(apiResponse) {
      this.currentAlertCounter = 10;
      this.message = "Current affairs uploaded, please check in app";
      this.alertColor = "success";
      this.disabled = false;
    },
  },
};
</script>
