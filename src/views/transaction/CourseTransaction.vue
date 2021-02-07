<template>
  <div>
     <CRow>
      <CCol sm="10" lg="4">
        <CSelect
          label="Company"
          required
          placeholder="Select Company"
          :options="companyList"
          :value.sync=companyId 
          @update:value=getCourseTransactions() 
        />
      </CCol>
    </CRow>
    <CRow v-show = "showCourseTransactions">
      
      <CCol sm="12">
        <CCard>
          <template>
            <CCardBody>
              <CDataTable
                :items="items "
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
  { key: "username", _style: "width:10%" },
  { key: "email", _style: "width:20%" },
  { key: "mobile", _style: "width:20%" },
  { key: "courseName", _style: "width:10%" },
  { key: "amountPaid", _style: "width:10%" },
  {key:"currentPrice",_style: "width:10%;"},
  { key: "paymentId", _style: "width:20%" },
  { key: "transactionDate", _style: "width:20%" },
  { key: "isRefunded", _style: "width:10%" },
];

export default {
  name: "Course List",
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
      collapseDuration: 0,
      showCourseTransactions:false,
      companyList: [],
      companyId : 0,
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

    generateCourseTList(apiResponse) {
      if (apiResponse.error != true) {
        var course = apiResponse.data.transactionList;
        this.items = course.map((item, id) => {
          return { ...item, id };
        });
        this.showCourseTransactions = true;
      }

    },
    getCourseTransactions() {
      this.showCourseList = false;
      var param = {};
      var data = {};
      data.limit = 0; 
      data.companyId = this.companyId;
      var url = "transaction/transaction/getCourseTransactions";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCourseTList);
    }

  }
};
</script>