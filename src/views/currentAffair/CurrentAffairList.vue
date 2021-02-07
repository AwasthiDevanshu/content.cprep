<template>
  <div>
    <CRow>
      <CCol sm="12">
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
                <template #imageUrl="{item}">
                  <a :href="item.imageUrl" target="_blank"
                    ><CImg :src="item.imageUrl" width="80px;" height="60px;" />
                  </a>
                </template>
                <template #actions="{item}">
                  <td>
                    <CCol col="3">
                      <CButton
                        color="primary"
                        variant="outline"
                        square
                        size="sm"
                        @click="editCurrentAffair(item)"
                        >Edit
                      </CButton>
                    </CCol>
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
          </template>
        </CCard>
      </CCol>
    </CRow>

    <CModal title="Add Banner" size="lg" :show.sync="bannerModal">
      <CForm @submit.prevent="addBanner()" wasValidated>
        <CRow>
          <CCol col="6">
            <CInput
              label="Banner name"
              v-model="bannerName"
              horizontal
              required
              placeholder="Enter Banner Name"
            />
          </CCol>
          <CCol col="6">
            <CInputFile
              required
              horizontal
              label="Banner"
              @change="handleFileUpload($event,'upload')"
              placeholder="Enter Banner"
            ></CInputFile>
          </CCol>
          <CCol col="6">
            <CInput
              required
              label="Valid From"
              type="date"
              v-model="validFrom"
              horizontal
              placeholder="Valid From"
            ></CInput>
          </CCol>
        </CRow>
        <CRow>
          <CCol col="12" align="center">
            <CButton type="submit" :disabled="disabled" color="success">Add Banner</CButton>
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
const fields = [
  { key: "id", _style: "width:10%", label: "TranslationId" },
  { key: "imageUrl", _style: "width:20%" },
  { key: "title", _style: "width:30%" },
  { key: "actions", _style: "width:30%", label: "" },
];

export default {
  name: "CurrentAffairList",
  mixins: [ajaxCallMixin, localDb],
  created() {
    this.getCurrentAffairList();
  },
  data() {
    return {
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      collapseDuration: 0,
    };
  },
  methods: {
    generateCourseTList(apiResponse) {
      if (apiResponse.error != true) {
        var course = apiResponse.data.currentAffairs;
        this.items = course.map((item, id) => {
          return { ...item, id };
        });
        this.showCourseTransactions = true;
      }
    },
    editCurrentAffair(item){
      
    },
    getCurrentAffairList() {
      this.showCourseList = false;
      var param = {};
      var data = {};
      data.limit = 0;
      data.companyId = this.companyId;
      var url = "misc/currentAffair/getCurrentAffairList";
      param.data = data;
      param.token = this.getToken();
      this.ajaxCall(url, param, this.generateCourseTList);
    },
  },
};
</script>
