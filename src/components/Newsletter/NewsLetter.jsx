import React from 'react'
import"./Newsletter.css"
const Newsletter = () => {
  return (
      <div className='news-letter'>
          <h1>Get Exclusive Offer On Your Email</h1>
          <p>Subscribe to our newsletter and stay updated.</p>
          <div>
              <input type="email" placeholder='Enter your email' />
              <button>Subscribe</button>
          </div>
      
    </div>
  )
}

export default Newsletter
