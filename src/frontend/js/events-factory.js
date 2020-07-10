const Swal = require('sweetalert2')

export function simpleAlert (message, type = 'warning') {
  Swal.fire({
    text: message,
    icon: type,
    confirmButtonText: 'OK'
  })
}
