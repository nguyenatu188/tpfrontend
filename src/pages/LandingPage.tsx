import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <>
      <Header />
      <div className="h-screen flex flex-col items-center justify-center gap-7">
        <h1 className="text-9xl font-jembrush text-center">Welcome to TripPlanner</h1>
        <p className="text-lg text-center">Giải pháp toàn diện cho những người đam mê du lịch</p>
        <Link to="/register">
          <button className="btn btn-lg btn-outline btn-info">Đăng ký ngay thôi!</button>
        </Link>
      </div>
      <Footer />
    </>
  )
}

export default LandingPage
