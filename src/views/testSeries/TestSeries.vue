<template>
  <div>
  
    <CRow>
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
        <template #showCandidate="{item,index}" >
        <td class="py-2">
          <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="showTestList(item, index)"
          >Show Test
          </CButton>
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
  { key: "title", _style: "width:40%" },
  { key: "testSeriesType", _style: "width:40%" },
  {key:"showCandidate",label:"",_style: "width:20%;",
    sorter: false,
    filter: false}
];
export default {
  name: "TestSeries List",
  mixins: [ajaxCallMixin, localDb],
  beforeMount() {
    this.getTestSeriesList();
  },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      testseriesName: "",
      collapseDuration: 0
    };
  },
  methods: {
    generateTestSeriesList(apiResponse) {
      if (apiResponse.error != true) {
        var testSeries = apiResponse.data.testSeriesList;
        this.items = testSeries.map((item, id) => {
          item.testSeriesType = item.testSeriesType.title;
          return { ...item, id };
        });
      }
    },
    getTestSeriesList() {
      var param = {};
      var data = {};
      data.limit = 0; 
      var url = "testSeries/testSeries/getTestSeriesList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateTestSeriesList);
    },
    toggleDetails(item) {
      this.$set(this.items[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    addTestSeries() {
      this.disabled = true;
      var param = {};
      var data = {};
      data.testseriesName = this.testseriesName;
      var url = "testseries/testseries/addEditTestSeries";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.getTestSeriesList);
      this.testseriesName;
    },
    showTestList(item, index){
        this.$router.push("/testList/"+item.testSeriesId)
    }
  }
};
</script>