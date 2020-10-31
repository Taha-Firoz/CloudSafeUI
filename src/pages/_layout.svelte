<script>
  import { TextInput, Button, InlineLoading } from "carbon-components-svelte";
  import Theme from "../components/Theme.svelte";
  import { axiosAPI, wait } from "../init_axios";
  import { json_policy_data } from "../stores.js";

  let ac_keys = "",
    sec_keys = "",
    fetching = null;

  function fetchPolicies() {
    fetching = "active";
    axiosAPI
      .post("policies", { ACCESS_KEY: ac_keys, SECRET_KEY: sec_keys })
      .then((res) => {
        json_policy_data.update(() => res.data);
        fetching = "finished";
        wait(2000).then(() => (fetching = null));
      })
      .catch((e) => {
        fetching = "error";
        wait(2000).then(() => (fetching = null));
        console.log(e);
      });
  }
</script>

<Theme persist theme="g90">
  <div class="flex flex-col h-screen min-h-0">
    <div class="flex w-full justify-between bg-carbon-90 p-2">
      <img
        src="/images/cloudsafe_logo_svg.svg"
        class="ml-4 w-20"
        alt="Kiwi standing on oval" />
      <div class="flex place-items-center space-x-2">
        <div class="flex-1 w-1/4">
          <TextInput
            disabled={ fetching !== null}
            bind:value={ac_keys}
            hideLabel
            size="sm"
            labelText="Access Key ID"
            placeholder="Access Key ID" />
        </div>
        <div class="flex-1 w-1/4">
          <TextInput
            disabled={ fetching !== null}
            bind:value={sec_keys}
            hideLabel
            size="sm"
            labelText="Secret Access Key"
            placeholder="Secret Access Key" />
        </div>
        <div class="w-40">
          {#if fetching === null}
            <Button
              disabled={!(ac_keys.length > 0 && sec_keys.length > 0)}
              on:click={fetchPolicies}
              size="small">
              Pull Policy
            </Button>
          {:else if fetching === 'active'}
            <InlineLoading status="active" description="Fetching Policy" />
          {:else if fetching === 'finished'}
            <InlineLoading
              status="finished"
              description="Fetch Successful" />
          {:else if fetching === 'error'}
            <InlineLoading status="error" description="Failed to Fetch" />
          {/if}
        </div>
      </div>
    </div>
    <slot />
  </div>
</Theme>
