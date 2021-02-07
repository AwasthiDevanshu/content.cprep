<template>
  <div>
    <CRow class="pb-4 pl-2">
      <CCol class="b-1">
        <CAlert color="success" :show.sync="currentAlertCounter" closeButton>
          {{message}}
          <CProgress :max="10" :value="currentAlertCounter" height="3px" color="success" animate />
        </CAlert>
      </CCol>
    </CRow>
    <CCard>
      <CCardBody>
        <CRow class="pb-4 pl-2">
          <CCol col="12">
            <CForm @submit.prevent ="addCompanyTestSeries">
              <CRow>
                <CCol sm="10" lg="4">
                  <CSelect
                    label="Company"
                    required
                    :value=companyId
                    placeholder="Select Company"
                    :options="companyList"
                    @update:value="getCompanyTestSeries($event)"
                  />
                </CCol>
              </CRow>

              <CCol col="12" v-show="displayTestSeries">
                <template v-for="(testSeries, optionIndex) in testSeriesList">
                  <CRow>
                    <CCol col="4">
                      <CInputCheckbox
                        :key="optionIndex + testSeries.title"
                        :label="testSeries.title"
                        :checked.sync="companyTestSeries[testSeries.testSeriesId]"
                      />
                    </CCol>
                    <CCol col="4">
                      <CInput
                        required
                        type="number"
                        :key="optionIndex + testSeries.title"
                        v-model="price[testSeries.testSeriesId]"
                        placeholder="Enter Price"
                      />
                    </CCol>
                  </CRow>
                </template>
              </CCol>
              <CCol col="12" class="text-center">
                <CButton type="submit" :disabled="disabled" color="success">Add TestSeries</CButton>
              </CCol>
            </CForm>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>




<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
const items = [{}];
const fields = [{ key: "companyName", _style: "width:40%" }];
export default {
  name: "AdvancedTables",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getCompanyList();
    this.getTestSeriesList();
  },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      companyId: 0,
      companyList: [],
      details: [],
      currentAlertCounter: 0,
      collapseDuration: 0,
      testSeriesList: [],
      disabled: false,
      companyTestSeries: {},
      price: {},
      displayTestSeries: false
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

    generateTestSeriesList(apiResponse) {
      if (apiResponse.error != true) {
        this.testSeriesList = apiResponse.data.testSeriesList;
        var defaultPrice = this.arrayColumn(
          apiResponse.data.testSeriesList,
          "price",
          "testSeriesId"
        );
        this.save("defaultPrice", defaultPrice);
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
    getCompanyTestSeries(companyId) {
      this.companyId = companyId;
      this.displayTestSeries = false;
      this.price = this.get("defaultPrice");
      this.companyTestSeries = {};
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;
      var url = "company/company/getCompanyTestSeries";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.populateCompanyTestSeries);
    },
    addCompanyTestSeries() {
      var data = {};
      this.companyTestSeries = this.arrayFilter(this.companyTestSeries);
      data.testSeriesId = Object.keys(this.companyTestSeries);
      data.companyId = this.companyId;
      data.priceList = this.price;
      var param = {};
      data.limit = 0;
      var url = "company/company/mapCompanyTestSettings";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.callBackaddCompanyTestSeries);
    },
    callBackaddCompanyTestSeries(apiResponse) {
      this.message = "Test series successfully updated";
      this.alertColor = "success";
      this.currentAlertCounter = 10;
    },
    populateCompanyTestSeries(apiResponse) {
      if (apiResponse.error != true) {
        var companyTestSeries = apiResponse.data.testSeriesList;
        companyTestSeries.forEach(testSeries => {
          this.companyTestSeries[testSeries.testSeriesId] = true;
          this.price[testSeries.testSeriesId] = testSeries.price;
        });
      }
      this.displayTestSeries = true;
    }
  }
};
</script>
          
