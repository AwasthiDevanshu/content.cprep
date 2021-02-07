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
    <CRow alignHorizontal="end">
      <CCol col="6" class="text-right">
        <CForm @submit.prevent ="addTest()" wasValidated>
          <CInput
            label="Test name"
            v-model="testName"
            horizontal
            required
            placeholder="Enter Test name"
          >
            <template #append>
              <CButton type="submit" :disabled="disabled" color="success">Add Test</CButton>
            </template>
          </CInput>
        </CForm>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <template>
          <CCard>
            <CCardBody>
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
                <template #questionCount="{ item }">
                  <td class="py-2">
                    <CInput :value.sync="item.questionCount"> </CInput>
                  </td>
                </template>
                <template #testDuration="{ item }">
                  <td class="py-2">
                    <CInput :value.sync="item.testDuration"> </CInput>
                  </td>
                </template>
                <template #testScore="{ item }">
                  <td class="py-2">
                    <CInput :value.sync="item.testScore"> </CInput>
                  </td>
                </template>
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(item, index)"
                      >{{ Boolean(item._toggled) ? "Hide" : "Edit" }}</CButton
                    >
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <CAlert :color=alertColor :show.sync=showAlert  closeButton>
                            {{ message }}
                          </CAlert>
                        </CCol>
                      </CRow>
                      <CRow v-show="uploadPaperVisiblity(item)">
                        <CCol>
                          <CForm @submit.prevent="uploadDocx(item)">
                            <CCol col="6">
                              <CInput
                                label="Positive marks"
                                horizontal
                                type="number"
                                step=".01"
                                :value.sync="item.positiveMarks"
                                required
                                placeholder="Enter Positive marks"
                              ></CInput>
                              <CInput
                                label="Negative marks"
                                horizontal
                                step=".01"
                                :value.sync="item.negativeMarks"
                                type="number"
                                required
                                placeholder="Enter Negative marks"
                              ></CInput>

                              <CInputFile
                                label="Test paper"
                                horizontal
                                accept="docx"
                                @change="handleFileUpload($event, 'testPaper')"
                                required
                                placeholder="Enter Test Paper"
                              ></CInputFile>
                            </CCol>
                            <CCol col="6">
                              <CButton
                                size="sm"
                                type="submit"
                                color="danger"
                                class="ml-1"
                                >Upload Paper</CButton
                              >
                            </CCol>
                          </CForm>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
        </template>
      </CCol>
    </CRow>
  </div>
</template>
  

</template>
<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
const items = [{}];
const tableFields = [
  { key: "testName", _style: "width:20%" },
  { key: "questionCount", _style: "width:20%;" },
  { key: "testScore", _style: "width:20%;" },
  { key: "testDuration", _style: "width:20%;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
    testName:""
  },
];
export default {
  name: "Candidate list",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getToken();
    this.getTestList();
  },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      tableFields,
      details: [],
      fields: [],
      collapseDuration: 0,
      showAlert: false,
      message:"",
      alertColor:"",
      fixedToasts:0
    };
  },
  methods: {
    generateCandidateList(apiResponse) {
      if (apiResponse.error != true) {
        this.items = apiResponse.data.testList.map((item, id) => {
          return { ...item, id };
        });
      }
    },
    getTestList() {
      var param = {};
      var testSeriesId = this.$route.params.testSeriesId;
      var data = { testSeriesId: testSeriesId };
      var url = "testSeries/testSeries/getTestList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCandidateList);
    },
    toggleDetails(item) {
      this.$set(this.items[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    uploadPaperVisiblity(item) {
      return item.allowedModules == "" ? true : false;
    },
    uploadDocx(testObj) {
      var param = {};
      var url = "qbank/qbank/uploadPaperDocx";
      param.data = testObj;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.callbackUploadDocx, this.fields);
    },
    callbackUploadDocx(apiResponse) {
      this.message = apiResponse.message;
      this.alertColor = apiResponse.error ? "warning" : "success";
      this.showAlert = true;
    },
    addTest(){
      var param = {};
      var testSeriesId = this.$route.params.testSeriesId;
      var data = { testSeriesId: testSeriesId };
      data["testName"] = this.testName;
      var url = "testSeries/testSeries/addEditTestSetting";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.callbackUploadDocx, this.fields);
    },
    addTestCallBack(){
      this.getTestList();
      this.message = apiResponse.message;
      this.alertColor = apiResponse.error ? "warning" : "success";
      this.fixedToasts++;
    }
  },
};
</script>