const sha1 = require('sha1')

const {
  get_previous_hash,
  get_next_hash
} = require('./globals.js')

function hash_comparator({ to_be_hashed, ME, functions_list }) {
  let hash = sha1(to_be_hashed)
  let MY_HASH = sha1(ME)
  let previous_hash = get_previous_hash()
  let next_hash = get_next_hash()

  if (hash < MY_HASH) {
    if (hash < previous_hash && MY_HASH > previous_hash)
      functions_list[0]['function_'](functions_list[0]['argument'])
    else
      functions_list[1]['function_'](functions_list[1]['argument'])
  } else {
    if (hash < next_hash || MY_HASH > next_hash)
      functions_list[2]['function_'](functions_list[2]['argument'])
    else
      functions_list[3]['function_'](functions_list[3]['argument'])
  } 
}

module.exports = { hash_comparator }
