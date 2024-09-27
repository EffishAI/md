<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([`close`])

function onUpdate(val: boolean) {
  if (!val) {
    emit(`close`)
  }
}

const links = [
  { label: `effish.ai`, url: `https://effish.ai` },
]

function onRedirect(url: string) {
  window.open(url, `_blank`)
}
</script>

<template>
  <Dialog :open="props.visible" @update:open="onUpdate">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>关于</DialogTitle>
      </DialogHeader>
      <div class="text-center">
        <img
          class="mx-auto my-5"
          src="https://effish.com/effish-font.svg"
          alt="Doocs Markdown 编辑器"
          style="width: 40%"
        >
        <h3>效率鱼是一款基于AI大模型的效率办公工具集</h3>
        <i style="font-size: small;">当前 Markdown 编辑器基于：<a href="https://github.com/doocs/md" target="_blank">Doocs Markdown</a></i>
        <br>
        <i style="font-size: small;">了解更多请关注开源作者公众号：Doocs</i>
      </div>
      <DialogFooter class="sm:justify-evenly">
        <Button
          v-for="link in links"
          :key="link.url"
          @click="onRedirect(link.url)"
        >
          {{ link.label }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
