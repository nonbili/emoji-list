import { EmojiList } from "../src/emoji-list";

const $input = document.querySelector("input");
const $emojiList = document.querySelector("emoji-list") as EmojiList;
const $emoji = document.querySelector("#emoji");

if ($input && $emoji) {
  $input.addEventListener("input", () => {
    $emojiList.setAttribute("filter", $input.value);
  });

  $emojiList.addEventListener("change", () => {
    $emoji.textContent = $emojiList.value;
  });
}
