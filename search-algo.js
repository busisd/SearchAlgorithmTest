const tail = (arr) => arr[arr.length - 1];
const objLen = (obj) => Object.keys(obj).length;
const arrToInt = (arr) => arr.map((i) => parseInt(i));

var all_char_list = {};

function add_char(cur_char, next_char, pos) {
  if (!all_char_list[cur_char]) {
    all_char_list[cur_char] = { [pos]: next_char };
  } else {
    all_char_list[cur_char][pos] = next_char;
  }
}

function build_char_list(text) {
  all_char_list = {};
  for (let i = 0; i < text.length - 1; i++) {
    add_char(text[i], text[i + 1], i);
  }
  if (text.length > 0) {
    add_char(tail(text), "END", text.length - 1);
  }
}

const searchable_content = document.getElementById("searchable-content");
searchable_content.onchange = () =>
  build_char_list(searchable_content.value.toLowerCase());

//Search algorithm
function find_first_dif(str1, str2) {
  let index = 0;
  while (
    index < Math.min(str1.length, str2.length) &&
    str1[index] == str2[index]
  )
    index++;
  return index;
}

const search_input = document.getElementById("search-input");
var all_result_sets = [];
var prev_search_val = "";

function filter_result_set(prev_results_set, new_char_locations) {
  if (
    !prev_results_set ||
    !new_char_locations ||
    objLen(prev_results_set) == 0
  ) {
    return {};
  }

  const new_results = {};
  for (key of arrToInt(Object.keys(prev_results_set))) {
    if (new_char_locations[key + 1]) {
      new_results[key + 1] = new_char_locations[key + 1];
    }
  }
  return new_results;
}

function search_next(new_char) {
  console.log("new_char: ", new_char);
  if (all_result_sets.length == 0) {
    all_result_sets.push(all_char_list[new_char] || {});
  } else {
    all_result_sets.push(
      filter_result_set(tail(all_result_sets), all_char_list[new_char])
    );
  }
}

function update_search(new_search_val) {
  let number_different = all_result_sets.length-find_first_dif(prev_search_val, new_search_val);
  for (let i=0; i<number_different; i++) {
    all_result_sets.pop();
  }
  prev_search_val = new_search_val;

  while (new_search_val.length > all_result_sets.length) {
    search_next(new_search_val[all_result_sets.length]);
  }

  if (tail(all_result_sets)) {
    highlight_ranges(create_ranges(tail(all_result_sets)));
    return create_ranges(tail(all_result_sets));
  } else {
    highlight_ranges([]);
    return [];
  }
}

search_input.oninput = () => console.log(update_search(search_input.value));

const create_ranges = (result_set) =>
  arrToInt(Object.keys(result_set)).map((i) => [
    i + 1 - all_result_sets.length,
    i + 1,
  ]);

var jquery_content = $("#searchable-content");
const highlight_ranges = (ranges) =>
  jquery_content.highlightWithinTextarea({
    highlight: ranges,
  });

highlight_ranges([]);
