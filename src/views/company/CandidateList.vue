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
      <CCol sm="10" lg="4">
        <CSelect
          label="Company"
          required
          placeholder="Select Company"
          :options="companyList"
          :value.sync="companyId"
          @update:value="getCandidateList()"
        />
      </CCol>
      <CCol sm="2" lg="4">
        <CCallout color="info">
          <small class="text-muted">Total Registration</small><br />
          <strong class="h4"> {{ candidateCount }}</strong>
        </CCallout>
      </CCol>
    </CRow>

    <CRow v-show="showCandidateList">
      <CCol sm="12">
        <CCard>
          <template>
            <CCardBody>
              <CDataTable
                :items="candidateList"
                :fields="fields"
                :columnFilter="{ external: true }"
                :items-per-page="30"
                hover
                sorter
                striped
                :loading="loading"
                fixed
                bordered
                :columnFilterValue.sync="filters"
                @update:column-filter-value="getCandidateList(0)"
              >
                <template #actions="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="editCandidateModal(item, index)"
                      >Edit</CButton
                    >
                    <CLink
                      class="btn btn-outline-primary btn-sm"
                      :to="showPurchases(item)"
                      >Puchases</CLink
                    >
                    <CButton
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      @click="blockCandidateModal(item, index)"
                      >Block</CButton
                    >
                  </td>
                </template>
              </CDataTable>
              <CPagination
                :activePage.sync="page"
                :pages="pages"
                size="sm"
                @update:activePage="pageChanged()"
                align="start"
              />
            </CCardBody>
          </template>
        </CCard>
      </CCol>
    </CRow>
    <CModal title="Block Candidate" centered size="lg" :show.sync="blockModal">
      <CForm @submit.prevent="blockCandidate()" wasValidated>
        <CRow>
          <CCol col="6">
            <CInput
              required
              label="Block Till"
              type="datetime-local"
              v-model="blockTill"
              horizontal
              placeholder="Block Till"
            />
          </CCol>

          <CCol col="12" align="center">
            <CButton type="submit" :disabled="disabled" color="danger"
              >Block</CButton
            >
          </CCol>
        </CRow>
      </CForm>
      <div slot="footer-wrapper"></div>
    </CModal>
    <CModal
      title="Edit Candidate"
      centered
      size="lg"
      :show.sync="candidateModal"
    >
      <CForm @submit.prevent="addEditCandidate()" wasValidated>
        <CRow>
          <CCol col="6">
            <CInput
              required
              label="Username"
              v-model="username"
              horizontal
              placeholder="Enter Username"
            />
          </CCol>
          <CCol col="6">
            <CInput
              label="Password"
              required
              v-model="password"
              horizontal
              placeholder="Enter password"
            />
          </CCol>
          <CCol col="6">
            <CInput
              label="Name"
              required
              v-model="name"
              horizontal
              placeholder="Enter Name"
            />
          </CCol>
          <CCol col="6">
            <CInput
              type="email"
              label="Email"
              required
              v-model="email"
              horizontal
              placeholder="Enter email"
            />
          </CCol>
          <CCol col="6">
            <CInput
              label="Mobile"
              required
              v-model="mobile"
              horizontal
              placeholder="Enter mobile"
            />
          </CCol>
          <CCol col="12" align="center">
            <CButton type="submit" :disabled="disabled" color="success"
              >Update</CButton
            >
          </CCol>
        </CRow>
      </CForm>
      <div slot="footer-wrapper"></div>
    </CModal>
  </div>
</template>
<style>
.word-breaker {
  word-break: break-all;
}
</style>
<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
const items = [{}];
const fields = [
  { key: "candidateId", _style: "width:10%" },
  { key: "name", _style: "width:10%" },
  { key: "username", _style: "width:10%" },
  { key: "password", _style: "width:10%" },
  { key: "email", _style: "width:10%;", _classes: "word-breaker" },
  { key: "mobile", _style: "width:10%" },
  {
    key: "actions",
    _style: "width:40%",
    label: "",
    sorter: false,
    filter: false,
  },
];
export default {
  name: "CandidateList",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getCompanyList();
    this.tableFields();
  },
  data() {
    return {
      fields,
      details: [],
      showCandidateList: false,
      courseName: "",
      collapseDuration: 0,
      companyId: 0,
      companyList: [],
      candidateList: [],
      username: "",
      name: "",
      password: "",
      mobile: "",
      email: "",
      candidateId: "",
      candidateModal: false,
      blockModal: false,
      disabled: false,
      blockTill: "",
      candidateCount: 0,
      fixedToasts: 0,
      message: "",
      hasError: false,
      pages: 1,
      page: 1,
      filters: {},
      loading: true,
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

    generateCandidateList(apiResponse) {
      if (apiResponse.error != true) {
        var candidateList = apiResponse.data.candidateList;
        this.showCandidateList = true;
        this.candidateList = candidateList;
        this.candidateCount = apiResponse.data.candidateCount;
        this.pages = Math.ceil(apiResponse.data.candidateCount / 30);
        this.loading = false;
      }
    },

    getCandidateList(offset = 0) {
      this.candidateList = [];
      this.loading = true;
      var param = {};
      var data = {};
      data.offset = offset;
      data.limit = 30;
      data.companyId = this.companyId;
      data.filters = this.filters;
      var url = "company/company/getCompanyCandidates";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCandidateList);
    },
    pageChanged() {
      var offset = 30 * (this.page - 1);
      this.getCandidateList(offset);
    },
    addEditCandidate() {
      this.disabled = true;
      this.candidateModal = false;
      var param = {};
      var data = {};
      data.username = this.username;
      data.password = this.password;
      data.name = this.name;
      data.companyId = this.companyId;
      data.email = this.email;
      data.mobile = this.mobile;
      data.candidateId = this.candidateId;
      var url = "candidate/candidate/candidateSignUp";
      param.data = data;

      param.token = this.getToken();
      this.ajaxCall(url, param, this.getCandidateList);
    },
    editCandidateModal(item, index) {
      this.disabled = false;
      this.username = item.username;
      this.name = item.name;
      this.password = item.password;
      this.mobile = item.mobile;
      this.email = item.email;
      this.candidateId = item.candidateId;
      this.candidateModal = true;
    },
    blockCandidateModal(item, index) {
      this.candidateId = item.candidateId;
      this.blockTill = item.lastLoginAt;
      this.blockModal = true;
    },
    blockCandidate() {
      var param = {};
      var data = {};
      data.candidateId = this.candidateId;
      data.blockedTill = this.blockTill;
      var url = "misc/misc/blockCandidate";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.callBackBlock);
    },
    callBackBlock(apiResponse) {
      if (apiResponse !== true) {
        this.hasError = false;
        this.message = "Candidate Blocked Successfully";
      } else {
        this.message = "Error occured";
        this.hasError = true;
      }
      this.blockModal = false;
      this.fixedToasts++;
    },
    showPurchases(item) {
      return "/candidatePurchases/" + item.candidateId + "/" + this.companyId;
      this.$router.push(
        "/candidatePurchases/" + item.candidateId + "/" + this.companyId
      );
    },
    tableFields() {
      var keys = this.get("candidateListTableKeys");
      if (keys) {
        this.fields = keys;
      }
    },
    setTableFields(keys) {
      this.save("candidateListTableKeys", keys);
      this.fields = keys;
    },
  },
};
</script>
