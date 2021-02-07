<template>
  <div>
    <CRow class="pb-4 pl-2">
        <CCol class="b-1">
        <CAlert
      color="success"
      :show.sync="currentAlertCounter"
      closeButton
    >{{message}}
      <CProgress
        :max="10"
        :value="currentAlertCounter"
        height="3px"
        color="success"
        animate
      />
    </CAlert>
      </CCol>
      <CForm   @submit.prevent ="addCompany"  >
        
        <h1 class="text-center" v-if = "!isEdit" >Add Company</h1>
        <h1 class="text-center" v-else>Edit Company</h1>
        <p class="text-muted text-center">Kindly verify all details before submitting</p>
        <CRow>
          <CCol sm="10" lg="4">
            <CInput 
            required label="Company Name" v-model="companyName" placeholder="Enter Company name" />
          </CCol>

          <CCol sm="10" lg="4">
            <CInput 
            required 
            label="Phone" type="tel"
            v-model="mobile" 
            pattern="[0-9]{10}" 
            placeholder="Enter Phone number" />
          </CCol>

          <CCol sm="10" lg="4">
            <CInput 
            required label="Email" 
            type="email" v-model="email" placeholder="Enter email" />
          </CCol>
          
          <CCol sm="10" lg="4">
            <CInput required 
            label="Webiste" v-model="website" placeholder="Enter Webiste" />
          </CCol>

          <CCol sm="10" lg="4">
            <CInput required 
            label="Address" v-model="address" placeholder="Enter Address" />
          </CCol>
          <CCol sm="10" lg="4">
            <CInput 
            type="tel"
            label="WhatsApp" v-model="whatsApp" placeholder="Enter WhatsApp Contact" />
          </CCol>
          <CCol sm="10" lg="4">
            <CInput 
            label="Youtube Channel" v-model="youtube" placeholder="Youtube Channel of institute(promotion)" />
          </CCol>

          <CCol sm="10" lg="4">
            <CInput
              label="Facebook"
              v-model="facebook"
              placeholder="Facebook page url"
            />
          </CCol>
          <CCol sm="10" lg="4">
            <CInput
              label="Twitter"
              v-model="twitter"
              placeholder="Twitter"
            />
          </CCol>

          <CCol sm="10" lg="4">
            <CInput 
            label="Telegram" v-model="telegram" placeholder="Enter Telegram" />
          </CCol>

          
          <CCol sm="10" lg="4">
            <CInput
              label="Company Logo url"
              required
              v-model="companyLogo"
              placeholder="Company Logo url"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol col="12" class="text-center">
            <CButton 
            :disabled=disabled
            type="submit" color="success">Add Company</CButton>
          </CCol>
        </CRow>
      </CForm>
    </CRow>
  </div>
</template>

<script>
import { ajaxCallMixin } from "../../components/HttpCommon";
import { localDb } from "../../components/localDb";
export default {
  name: "AddCompany",
  mixins: [ajaxCallMixin, localDb],
  data() {
    return {
      disabled:false,
      companyId: 0,
      companyName: "",
      email:"",
      address:"",
      website:"",
      mobile:"",
      whatsApp:"",
      youtube:"",
      facebook:"",
      twitter:"",
      telegram:"",
      companyLogo:"",
      fields: {},
      company: {},
      profilePic: "",
      currentAlertCounter: 0,
      skill:[],
      gender:"",
      message:"",
      skillList:[]
    };
  },
  computed: {
    token: function() {
      return this.getToken();
    },
    isEdit:function(){
      if(this.$route.params.companyId){
        return true;
      }
      return false;
    }
  },
  methods: {
    addCompany() {
      this.disabled = true;
      var param = {};
      var data = {};
      var companyId = this.$route.params.companyId;
      data.companyId = companyId;
      data.companyName = this.companyName;
      data.mobileNo = this.mobile;
      data.email = this.email;
      data.website = this.website ;
      data.address = this.address ;
      data.whatsApp = this.whatsApp;
      data.youtube = this.youtube;
      data.facebook = this.facebook;
      data.twitter = this.twitter;
      data.telegram = this.telegram;
      data.companyLogo = this.companyLogo
      var url = "company/company/addEditCompany";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.callBackAddCompany, this.fields);
    },
    callBackAddCompany(apiResponse) {
      this.disabled = false;
      this.message = "Company has been added successfully";
      this.alertColor = "success";
      this.currentAlertCounter = 10;
    },
    getAddCompanyDropDown() {
     
    },
    getCompanyDetails(){
       var param = {};
       var data = {};
      data.companyId = this.$route.params.companyId;
      var url = "company/company/getCompanyDetails";
      param.data = data;
      param.token = this.token;
      this.ajaxCall(url, param, this.populateCompanyDetails);
    },
    populateList(apiResponse) {
      if (apiResponse.error != true) {
        this.skillList = this.changeMapToSelect(apiResponse.data.skillList);
     
      }
    },
    populateCompanyDetails: function(apiResponse){
      if (apiResponse.error != true) {
        var companyDetails = apiResponse.data.companyDetails;
        this.companyName = companyDetails.companyName;
        this.phone = companyDetails.phone;
        this.email = companyDetails.email;
        this.gender = companyDetails.gender;
        this.dob = companyDetails.dob;
        this.website = companyDetails.website;
        this.city = companyDetails.city;
        this.state = companyDetails.state;
        this.address = companyDetails.address;
        this.highestQualification = companyDetails.highestQualification;
        this.experience = companyDetails.experience;
        this.sdmsUsername = companyDetails.sdmsUsername;
        this.sdmsPassword = companyDetails.sdmsPassword;
        var companySkills = apiResponse.data.companySkills;
        var skill2 = Object.keys(companySkills);
        this.skill = skill2;
      }
    },
  },
  created() {
    this.getAddCompanyDropDown();
  },
  mounted(){
       if(this.$route.params.companyId){
        this.getCompanyDetails();
      }
  }
};
</script>>