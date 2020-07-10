const Swal = require('sweetalert2')

export function simpleAlert (message, type = 'warning') {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    text: message,
    icon: type,
    imageSize: '30x30'
  })
  // Swal.fire({
  //   text: message,
  //   icon: type,
  //   confirmButtonText: 'OK'
  // })
}
