<script>
    import { TextInput } from "carbon-components-svelte";
</script>

<div class="flex flex-col h-screen min-h-0">
    <div class="flex w-full justify-end bg-carbon-90 p-1 space-x-4">
        <div class="w-1/6">
            <TextInput hideLabel size="sm" labelText="Access Key ID" placeholder="Access Key ID" />
        </div>
        <div class="w-1/6">
            <TextInput hideLabel size="sm" labelText="Secret Access Key" placeholder="Secret Access Key" />
        </div>
    </div>
    <slot />
</div>
    