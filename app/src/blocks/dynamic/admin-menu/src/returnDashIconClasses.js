import { computed } from "vue";
import { dashIconsList } from "./constants.js";

/**
 * Computed property that generates CSS classes for dashboard icons.
 * @returns {string} A string of CSS styles for dashboard icons.
 */
export const returnDashIconClasses = computed(() => {
  return dashIconsList.value
    .map((item) => {
      if (item.before) {
        if (item.before.includes("url(")) {
          item.backGroundImage = item.before;
          item.before = "";
        }
      }

      return `
	${item.class}:before {
	  content: '${item.before || ""}';
	  height: 1.2rem;
	  width: 1.2rem;
	  min-height: 1.2rem;
	  min-width: 1.2rem;
	  color: currentColor;
	  font-size: 1.2rem;
	  background-size: contain;
	  background-repeat: no-repeat;
	  background-position: center center;
	  ${item.font ? `font-family: '${item.font}' !important;` : ""}
	  ${item.backGroundImage ? `background-image: ${item.backGroundImage} !important;` : ""}
	  ${item.backGroundImage ? `filter: contrast(0.3);` : ""}
	}
  `;
    })
    .join("\n");
});
