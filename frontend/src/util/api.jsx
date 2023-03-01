export const apiCall = (route, method, rqstBody, reqToken = true, queryBody) => {
  return new Promise((resolve, reject) => {
    const init = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' ? undefined : JSON.stringify(rqstBody),
    }
    if (reqToken) init.headers.Authorization = `Bearer ${localStorage.getItem('Authorization')}`

    let url = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/${route}`
    if (queryBody) {
      url = url + '?' + new URLSearchParams(queryBody)
    }

    fetch(url, init).then(response => response.json()).then(body => {
      if (body.error) {
        alert(body.error)
      } else {
        resolve(body)
      }
    }).catch(err => {
      alert(`API call error: ${err}`)
    })
  })
}

export const login = (email, password) => {
  return apiCall('auth/login', 'POST', { email, password }, false)
}

export const recommend = (courses, delivery) => {
  return apiCall('auth/recommend', 'GET', {}, true, { courses, delivery })
}

export const register = (name, email, password, tutor, description, delivery, postcode, hourlyRate, teaching) => {
  return apiCall('auth/register', 'POST', { name, email, password, tutor, description, delivery, postcode, hourlyRate, teaching }, false)
}

export const fetchTutors = (sort, name, delivery, postcode, subject, minRating, minPrice, maxPrice) => {
  return apiCall('auth/tutor', 'GET', {}, false, { sort, name, delivery, postcode, subject, minRating, minPrice, maxPrice })
}

export const fetchTutor = (userId) => {
  return apiCall(`auth/tutor/${userId}`, 'GET', {}, false)
}

export const fetchUser = () => {
  return apiCall('auth/', 'GET', {})
}

export const deleteUser = () => {
  return apiCall('auth/', 'DELETE', {})
}

export const searchForCourse = (courseCode) => {
  return apiCall(`courses/${courseCode}`, 'GET', {})
}

export const userEdit = (reqBody) => {
  return apiCall('auth/', 'PUT', reqBody)
}

export const accessChats = (userId) => {
  return apiCall('chat/', 'POST', { userId })
}

export const fetchChats = () => {
  return apiCall('chat/', 'GET', {})
}

export const sendMessage = (content, chatId) => {
  return apiCall('message/', 'POST', { content, chatId })
}

export const fetchMessages = (chatID) => {
  return apiCall(`message/${chatID}`, 'GET', {})
}

export const fetchTutorReviews = (tutorId) => {
  return apiCall(`review/${tutorId}`, 'GET', {}, false)
}

export const postReview = (tutorId, overallRating, usefullness, worthiness, flexibility, note) => {
  return apiCall('review/', 'POST', { tutorId, overallRating, usefullness, worthiness, flexibility, note })
}

export const postAppointment = (tutor, student, price, duration, delivery, date, subject) => {
  return apiCall('appointment/', 'POST', { tutor, student, price, duration, delivery, date, subject })
}

export const getAppointments = () => {
  return apiCall('appointment/', 'GET', {})
}

export const updateAppointment = (appointmentId, newStatus) => {
  return apiCall('appointment/', 'PUT', { appointmentId, newStatus })
}

export const setPaidAppointment = (appointmentId) => {
  return apiCall('appointment/pay/', 'PUT', { appointmentId })
}
