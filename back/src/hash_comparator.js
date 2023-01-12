const sha1 = require('sha1')

const { get_my_hash, get_previous_hash, get_next_hash } = require('./globals.js')

function hash_comparator({ to_be_hashed, functions_list }) {
  let hash = sha1(to_be_hashed)
  let my_hash = get_my_hash()
  let previous_hash = get_previous_hash()
  let next_hash = get_next_hash()

  if ( (hash < my_hash && hash > previous_hash)    || 
       (previous_hash > my_hash &&
         (hash < my_hash || hash > previous_hash)
       )
     ) {
    functions_list[1]['function_'](functions_list[1]['argument'])
  } else if (hash < my_hash) {
      functions_list[0]['function_'](functions_list[0]['argument'])
  } else {
      functions_list[2]['function_'](functions_list[2]['argument'])
  } 
}

module.exports = { hash_comparator }
