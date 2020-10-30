<script>
    import { TextInput, Button } from "carbon-components-svelte";
    import Theme from "../components/Theme.svelte";
    let ac_keys = ""; 
    let sec_keys = "";
</script>
<Theme persist theme="g90">
    <div class="flex flex-col h-screen min-h-0">
        <div class="flex w-full justify-between bg-carbon-90 p-2">
            <img src="/images/cloudsafe_logo_svg.svg" class="ml-4 w-20" alt="Kiwi standing on oval">
            <div class="flex place-items-center space-x-2">
                <div class="flex-1 w-1/4">
                    <TextInput bind:value={ac_keys} hideLabel size="sm" labelText="Access Key ID" placeholder="Access Key ID" />
                </div>
                <div class="flex-1 w-1/4">
                    <TextInput bind:value={sec_keys} hideLabel size="sm" labelText="Secret Access Key" placeholder="Secret Access Key" />
                </div>
                <Button disabled={!(ac_keys.length>0 &&  sec_keys.length>0)} size="small">Pull Policy</Button>
            </div>
        </div>
        <slot />
    </div>
</Theme>