<template>
	<lcd
		:segmentWidth="0.06"
		:segmentInterval="0.05"
		:strokeWidth="0.01"
		:elements="8"
		:display="display"
		:elementSpacing="0"
		:elementPadding="0"
		:width="width"
		:height="height"
		:top="top"
		:left="left"
		color="white"
		:border="borderStyle"
		:style="boxStyle"
		:label="label"
	/>
</template>

<script>
export default {
	props: ["display", "label", "width", "height", "top", "left"],
	computed: {
		boxStyle() {
			return {
				border: { fg: "green" },
				fg: "white",
				bold: true
			}
		},
		borderStyle() {
			return {
				type: "line"
			}
		}
	},
}
</script>
