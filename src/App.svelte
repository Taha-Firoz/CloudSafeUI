<script lang="ts">
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import './tailwind.css';
</script>

<style  global>
  @import "../assets/global.css";
  @import "carbon-components-svelte/css/g90";
</style>


<Router {routes} />