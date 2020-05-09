const tail = arr => arr[arr.length - 1];
const objLen = obj => Object.keys(obj).length;
const arrToInt = arr => arr.map(i => parseInt(i));

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
    add_char(text[i], text[i+1], i);
  }
  if (text.length > 0) {
    add_char(tail(text), "END", text.length-1);
  }
}

const searchable_content = document.getElementById("searchable-content");
searchable_content.onchange = () => build_char_list(searchable_content.value.toLowerCase());



//Search algorithm
const search_input = document.getElementById("search-input");
var all_result_sets = [];
var cur_search_len = 0;

function filter_result_set(prev_results_set, new_char_locations) {
  if (!prev_results_set || !new_char_locations || objLen(prev_results_set) == 0) {
    return {};
  }

  const new_results = {}
  for (key of arrToInt(Object.keys(prev_results_set))) {
    if (new_char_locations[key+1]) {
      new_results[key+1] = new_char_locations[key+1];
    }
  }
  return new_results;
}

function search_next(new_char) {
  if (cur_search_len == 0) {
    all_result_sets.push(all_char_list[new_char] || {});
  } else {
    all_result_sets.push(filter_result_set(tail(all_result_sets), all_char_list[new_char]));
  }
  cur_search_len++;
}

function update_search(new_search_val) {
  //Note: if someone changes the string, this won't work
  while (new_search_val.length > cur_search_len) {
    search_next(new_search_val[cur_search_len]);
  }

  if (new_search_val.length < cur_search_len) {
    all_result_sets = all_result_sets.slice(0, new_search_val.length);
  }

  return tail(all_result_sets);
}

search_input.oninput = () => console.log(update_search(search_input.value));
