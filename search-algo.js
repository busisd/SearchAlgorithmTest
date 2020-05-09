const tail = (arr) => arr[arr.length - 1];
const objLen = (obj) => Object.keys(obj).length;
const arrToInt = (arr) => arr.map((i) => parseInt(i));

var all_char_list = {};

function add_char(cur_char, pos) {
  if (!all_char_list[cur_char]) {
    let new_char_set = new Set();
    new_char_set.add(pos);
    all_char_list[cur_char] = new_char_set;
  } else {
    all_char_list[cur_char].add(pos);
  }
}

function build_char_list(text) {
  all_char_list = {};
  for (let i = 0; i < text.length; i++) {
    add_char(text[i], i);
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
    prev_results_set.size == 0
  ) {
    return new Set();
  }

  const new_results = new Set();
  for (pos of prev_results_set) {
    if (new_char_locations.has(pos + 1)) {
      new_results.add(pos + 1);
    }
  }
  return new_results;
}

function search_next(new_char) {
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
  Array.from(result_set).map((i) => [
    i + 1 - all_result_sets.length,
    i + 1,
  ]);

var jquery_content = $("#searchable-content");
const highlight_ranges = (ranges) =>
  jquery_content.highlightWithinTextarea({
    highlight: ranges,
  });

highlight_ranges([]);
