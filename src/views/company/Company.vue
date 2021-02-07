<template>
  <div>

    <CRow>
      <CCol sm ="12">
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
              <template #actions="{item}">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="editCompany(item)"
                    >Edit</CButton>
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
  { key: "companyId", _style: "width:40%" },
  { key: "companyName", _style: "width:40%" },
  { key: "actions", _style: "width:40%" },
];
export default {
  name: "AdvancedTables",
  mixins: [ajaxCallMixin, localDb],
  beforeMount(){
    this.getCompanyList();
 },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      collapseDuration: 0
    };
  },
  methods: {

    generateCompanyList(apiResponse) {
      if (apiResponse.error != true) {
        this.items = apiResponse.data.companyList;
        localDb.save(apiResponse.data.companyList);
      }
    },
    getCompanyList() {
      var param = {};
      var data = {  };
      var url = "company/company/getCompanyList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCompanyList);
    },
    toggleDetails(item) {
      this.$set(this.items[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    editCompany(item){

    }
  }
};
</script>