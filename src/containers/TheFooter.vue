<template>
  <CFooter :fixed="false">
    <div>
      <a href="https://cprep.in" target="_blank">C-prep</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} </span>
    </div>
    <div class="ml-auto">
      <span class="mr-1">Powered by</span>
      <a href="https://cprep.in" target="_blank">Cprep</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
