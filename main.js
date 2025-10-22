import './style.css'
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function updateCountdown() {
  const weddingDate = new Date('2024-12-14T16:00:00').getTime()
  const now = new Date().getTime()
  const distance = weddingDate - now

  if (distance < 0) {
    document.getElementById('days').textContent = '00'
    document.getElementById('hours').textContent = '00'
    document.getElementById('minutes').textContent = '00'
    document.getElementById('seconds').textContent = '00'
    return
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  document.getElementById('days').textContent = String(days).padStart(2, '0')
  document.getElementById('hours').textContent = String(hours).padStart(2, '0')
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0')
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0')
}

function setupRSVPForm() {
  const form = document.getElementById('rsvpForm')
  const attendanceSelect = document.getElementById('attendance')
  const guestsGroup = document.getElementById('guestsGroup')
  const mealGroup = document.getElementById('mealGroup')
  const submitBtn = form.querySelector('.submit-btn')
  const formMessage = document.getElementById('formMessage')

  attendanceSelect.addEventListener('change', (e) => {
    if (e.target.value === 'not_attending') {
      guestsGroup.style.display = 'none'
      mealGroup.style.display = 'none'
      document.getElementById('numberOfGuests').removeAttribute('required')
    } else {
      guestsGroup.style.display = 'block'
      mealGroup.style.display = 'block'
      document.getElementById('numberOfGuests').setAttribute('required', 'required')
    }
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    submitBtn.disabled = true
    submitBtn.querySelector('.btn-text').style.display = 'none'
    submitBtn.querySelector('.btn-loader').style.display = 'inline'
    formMessage.className = 'form-message'
    formMessage.textContent = ''

    const formData = {
      guest_name: document.getElementById('guestName').value.trim(),
      email: document.getElementById('email').value.trim() || null,
      attendance: document.getElementById('attendance').value,
      number_of_guests: document.getElementById('attendance').value === 'attending'
        ? parseInt(document.getElementById('numberOfGuests').value)
        : 0,
      meal_preference: document.getElementById('mealPreference').value || null,
      message: document.getElementById('message').value.trim() || null
    }

    try {
      const { data, error } = await supabase
        .from('rsvp_submissions')
        .insert([formData])
        .select()

      if (error) throw error

      formMessage.className = 'form-message success'
      formMessage.textContent = 'Thank you for your RSVP! We look forward to celebrating with you.'
      form.reset()
      guestsGroup.style.display = 'none'
      mealGroup.style.display = 'none'
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      formMessage.className = 'form-message error'
      formMessage.textContent = 'There was an error submitting your RSVP. Please try again.'
    } finally {
      submitBtn.disabled = false
      submitBtn.querySelector('.btn-text').style.display = 'inline'
      submitBtn.querySelector('.btn-loader').style.display = 'none'
    }
  })
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0'
    section.style.transform = 'translateY(20px)'
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    observer.observe(section)
  })
}

updateCountdown()
setInterval(updateCountdown, 1000)

setupRSVPForm()
setupSmoothScroll()
observeElements()
