<template>
  <CContainer class="d-flex content-center min-vh-100">
    <CRow>
        
      <CCol>
        <CAlert
      color="danger"
      :show.sync="currentAlertCounter"
      closeButton
    >
      Incorrect credentials please check.
      <CProgress
        :max="10"
        :value="currentAlertCounter"
        height="3px"
        color="danger"
        animate
      />
    </CAlert>
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <CForm>
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <CInput id="username"
                  placeholder="Username"
                  autocomplete="username email"
                  v-model="username"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  id="password"
                  placeholder="Password"
                  type="password"
                  autocomplete="curent-password"
                  v-model="password"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CRow>
                  <CCol col="6" class="text-left">
                    <CButton @click="loginUser" color="primary" class="px-4">Login</CButton>
                  </CCol>
                  <CCol col="6" class="text-right">
                    <CButton @click="forgetPassword" class="px-0">Forgot password?</CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
         
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import {ajaxCallMixin} from '../../components/HttpCommon'
import {localDb} from '../../components/localDb'
export default {
  name: 'Login',
  data () {
    return {
      currentAlertCounter: 0
    }
  },
  mixins: [ajaxCallMixin,localDb],
  methods : {
               loginUser : function() {
                  var data = {'username': this.username, 'password': this.password}
                  var url = 'authenticator/auth/loginUser'
                  var param = {}
                  param.data = data
                  this.ajaxCall(url, param, this.saveLoginUser)
               },
               forgetPassword : function() {
                  var data = {'username': this.username, 'password': this.password}
                  var url = 'authenticator/auth/loginUser'
                  var param = {}
                  param.data = data
                  this.ajaxCall(url, param)
               },
               saveLoginUser : function (apiResponse){
                 if(apiResponse.error != true){
                  var userData = apiResponse.data;
                  this.currentAlertCounter = 0
                  this.save("loginUser",userData);
                  this.save("token",userData.userToken);
                  this.save("tokenExpiry",userData.expiryTime);
                  this.$router.push("/testSeries")
                 }
                 else{
                   this.currentAlertCounter = 10
                 }
               }
            },
            
} 
</script>
